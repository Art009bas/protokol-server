import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
    console.error("Ошибка регистрации:", err); // 👈 покажет в Render логах
    return res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
};
