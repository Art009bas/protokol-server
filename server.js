import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import meetingRoutes from './routes/meeting.routes.js';
import taskRoutes from './routes/task.routes.js';
import { verifyToken } from './middleware/auth.middleware.js';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/user.routes.js';
app.use('/users', userRoutes);


dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/meetings', verifyToken, meetingRoutes);
app.use('/tasks', verifyToken, taskRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
