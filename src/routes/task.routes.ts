import express from 'express';
import { authentication } from '../middleware/auth.middleware';
import {
  createNewTask,
  deleteTask,
  getAllUserTask,
  getSingleTask,
  searchTask,
  updateTaskDetails,
  updateTaskStatus,
} from '../controller/task.controller';
const router = express.Router();

//*** Create a new task ***//
router.post('/create', authentication, createNewTask);

//*** Search specific user task ***//
router.get('/searchTask', authentication, searchTask);

//*** Get all user related tasks ***//
router.get('/', authentication, getAllUserTask);

//*** Get single task ***//
router.get('/:id', authentication, getSingleTask);

//*** Update task details ***//
router.put('/update/:id', authentication, updateTaskDetails);

//*** Update task status ***//
router.put('/update-status/:id', authentication, updateTaskStatus);

//*** Delete task ***//
router.delete('/delete/:id', authentication, deleteTask);

export default router;
