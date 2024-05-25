import { boolean, z } from 'zod';
import Todo from '../models/todo.model.js';

const todoSchema = z.object({
  title: z.string().min(1, { message: 'Required' }),
  description: z.string().min(1, { message: 'Required' }),
  isCompleted: z.boolean(),
});

export async function getTodosController(req, res) {
  try {
    const todos = await Todo.find({});
    res.status(200).json({
      success: true,
      message: 'Todos fetched succsessfully!',
      data: todos,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: 'Something is wrong!',
    });
  }
}

export async function addTodoController(req, res) {
  try {
    const validatedData = todoSchema.parse(req.body);
    const { title, description, isCompleted } = validatedData;

    const createTodo = await Todo.create({
      title,
      description,
      isCompleted,
    });

    res.status(201).json({
      success: true,
      message: 'Todo added successfully',
      data: createTodo,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: 'Todo could not be added!',
    });
  }
}

export async function deleteTodoController(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Todo Id is needed',
      });
    }

    const deleteTodo = await Todo.findByIdAndDelete(id);

    if (!deleteTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found for deleted',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully!',
      deleteTodo,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: 'Todo could not be deleted!',
    });
  }
}

export async function editTodoController(req, res) {
  try {
    const { id } = req.params;
    const checkTodo = await Todo.findById(id);

    if (!checkTodo) {
      return res.status(400).json({
        success: false,
        message: 'Todo does not exist!',
      });
    }
    const validatedData = todoSchema.parse(req.body);
    const { title, description, isCompleted } = validatedData;

    const editedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        description,
        isCompleted,
      },
      { new: true }
    );

    if (!editedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo updated!',
      editedTodo,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: 'Todo could not be edited!',
    });
  }
}
