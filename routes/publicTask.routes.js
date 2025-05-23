import express from 'express';
import { getPublicTasks, createPublicTask } from '../controllers/publicTask.controller.js';
const router = express.Router();

router.get('/', getPublicTasks);
router.post('/', createPublicTask);

export default router;
