import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password: hashed } });

    return res.status(201).json({ message: "Пользователь создан" });

  } catch (err) {
    console.error("Ошибка регистрации:", err);
    return res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error("Ошибка входа:", err);
    res.status(500).json({ message: 'Ошибка входа' });
  }
};

export const telegramAuth = async (req, res) => {
  const data = req.body;
  const { hash, ...authData } = data;

  const secret = crypto.createHash('sha256')
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();

  const sorted = Object.keys(authData).sort().map(k => `${k}=${authData[k]}`).join('\n');
  const checkHash = crypto.createHmac('sha256', secret).update(sorted).digest('hex');

  if (checkHash !== hash) {
    return res.status(403).json({ message: 'Недопустимая подпись' });
  }

  const telegramId = authData.id.toString();
  const email = `${telegramId}@telegram`;

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: 'telegram'
      }
    });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.redirect(`https://protokol-client.onrender.com?token=${token}`);
};
