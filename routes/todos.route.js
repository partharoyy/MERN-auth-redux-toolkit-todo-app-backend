import express from 'express';
import {
  addTodoController,
  deleteTodoController,
  editTodoController,
  getTodosController,
} from '../controllers/todos.contoller.js';

const router = express.Router();

router.get('/', getTodosController);
router.post('/', addTodoController);
router.delete('/:id', deleteTodoController);
router.put('/:id', editTodoController);

export default router;
