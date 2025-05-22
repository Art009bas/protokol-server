import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const addTask = async (req, res) => {
  const { text, responsible, deadline, priority, meetingId } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        text, responsible, priority,
        deadline: deadline ? new Date(deadline) : null,
        meetingId
      }
    });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: 'Ошибка добавления' });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { text, responsible, deadline, priority, completed } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        text, responsible, priority, completed,
        deadline: deadline ? new Date(deadline) : null
      }
    });
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Ошибка обновления' });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: 'Удалено' });
  } catch {
    res.status(500).json({ message: 'Ошибка удаления' });
  }
};
