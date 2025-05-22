import express from 'express';
import { addTask, updateTask, deleteTask } from '../controllers/task.controller.js';
const router = express.Router();

router.post('/', addTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
