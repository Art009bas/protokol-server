import crypto from 'crypto'; // добавить наверху файла, если нет

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

  const prisma = new PrismaClient();

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
