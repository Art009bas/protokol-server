import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes.js';
import meetingRoutes from './routes/meeting.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js'; // ✅ импортируем
import publicTaskRoutes from './routes/publicTask.routes.js';

import { verifyToken } from './middleware/auth.middleware.js';

dotenv.config();
const app = express(); // ✅ создаём app

const prisma = new PrismaClient();

app.use('/public-tasks', publicTaskRoutes);
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/meetings', verifyToken, meetingRoutes);
app.use('/tasks', verifyToken, taskRoutes);
app.use('/users', userRoutes); // ✅ используем после app

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});

