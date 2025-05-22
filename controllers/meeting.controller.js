import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getMeetings = async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({
      where: { userId: req.userId },
      include: { tasks: true }
    });
    res.json(meetings);
  } catch {
    res.status(500).json({ message: 'Ошибка получения планёрок' });
  }
};

export const createMeeting = async (req, res) => {
  try {
    const { title, date, notes } = req.body;
    const meeting = await prisma.meeting.create({
      data: { title, date: new Date(date), notes, userId: req.userId }
    });
    res.status(201).json(meeting);
  } catch {
    res.status(500).json({ message: 'Ошибка создания' });
  }
};
