import express from 'express';
import {
  addTodoController,
  deleteTodoController,
  editTodoController,
  getTodosController,
} from '../controllers/todos.contoller.js';
import { signinController, signupController } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/', getTodosController);
router.post('/', addTodoController);
router.delete('/:id', deleteTodoController);
router.put('/:id', editTodoController);
router.post('/signup', signupController);
router.post('/signin', signinController);

export default router;
