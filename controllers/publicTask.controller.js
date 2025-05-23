import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getPublicTasks = async (req, res) => {
  const tasks = await prisma.publicTask.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(tasks);
};

export const createPublicTask = async (req, res) => {
  const { text } = req.body;
  const task = await prisma.publicTask.create({ data: { text } });
  res.json(task);
};
