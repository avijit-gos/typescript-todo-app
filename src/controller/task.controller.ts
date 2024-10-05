import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import CreateError from 'http-errors';
import CustomRequest from '../interface/customrequest.interface';
import taskModel from '../model/task.model';
import ITask from '../interface/task.interface';
import { isValidStatus } from '../utils/checkTask.status';

//*** Create a new task ***//
export const createNewTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, startDate, startTime } = req.body;
    if (!title) throw CreateError.BadRequest('Provide task title');
    if (!description) throw CreateError.BadRequest('Provide task description');
    if (!startDate) throw CreateError.BadRequest('Provide task start date');
    if (!startTime) throw CreateError.BadRequest('Provide task start time');

    // Replace slashes in date with hyphens to match the expected Date format
    const formattedStartDate = startDate.replace(/\//g, '-');
    // Combine date and time into a single string
    const combinedDateTimeString = `${formattedStartDate}T${startTime}:00`;
    // Create a JavaScript Date object in local time
    const localDateTime = new Date(combinedDateTimeString);
    // Convert to UTC
    const endDateTimeInUTC = new Date(
      localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000,
    );

    const newTask = new taskModel({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      startDate: endDateTimeInUTC,
      user: req.user._id,
    });
    const task: ITask | null = await newTask.save();
    res
      .status(201)
      .json({ message: 'A new task has been created', status: 201, task });
  } catch (error) {
    next(error);
  }
};

//*** Get all user related tasks ***//
export const getAllUserTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const operation = req.query.sortType
      ? {
          $and: [{ status: req.query.sortType }, { status: { $ne: 'delete' } }],
        }
      : { status: { $ne: 'delete' } };

    const tasks: ITask[] | null = await taskModel
      .find(operation)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));
    const totalCount: number | undefined =
      await taskModel.countDocuments(operation);
    res.status(200).json({
      message: 'Fetch tasks for user',
      status: 200,
      totalCount,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

//*** Get single task ***//
export const getSingleTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.params.id) throw CreateError.BadRequest('Task id is not provided');
    const task: ITask | null = await taskModel.findById(req.params.id);
    if (!task)
      throw CreateError.BadRequest(`No task found with ${req.params.id}`);
    if (task.status === 'delete')
      CreateError.BadRequest('This task has been deleted');
    res
      .status(200)
      .json({ message: 'A single task has been fetched', status: 200, task });
  } catch (error) {
    next(error);
  }
};

//*** Search specific user task ***//
export const searchTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const operation = req.query.searchTerm
      ? {
          $and: [
            { status: { $ne: 'delete' } },
            { user: req.user._id },
            {
              $or: [
                { title: { $regex: req.query.searchTerm, $options: 'i' } },
                {
                  description: { $regex: req.query.searchTerm, $options: 'i' },
                },
              ],
            },
          ],
        }
      : {
          $and: [{ status: { $ne: 'delete' } }, { user: req.user._id }],
        };
    const tasks: ITask[] | null = await taskModel
      .find(operation)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));
    const totalCount: number | null = await taskModel.countDocuments(operation);
    res.status(200).json({
      message: `List of search result for ${req.query.searchTerm}`,
      status: 200,
      tasks,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

//*** Update task details ***//
export const updateTaskDetails = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.params.id) throw CreateError.BadRequest('Task id is not provided');
    const originalTaskData: ITask | null = await taskModel.findById(
      req.params.id,
    );
    if (!originalTaskData)
      throw CreateError.BadRequest(`No task found with ${req.params.id}`);
    if (originalTaskData.status === 'delete')
      CreateError.BadRequest('This task has been deleted');
    if (originalTaskData.user.toString() !== req.user._id.toString())
      throw CreateError.BadRequest(
        'You cannot have enough permission to updated the task',
      );

    let endDateTimeInUTC: Date | undefined;
    if (req.body.startDate && req.body.startTime) {
      // Replace slashes in date with hyphens to match the expected Date format
      const formattedStartDate = req.body.startDate.replace(/\//g, '-');
      // Combine date and time into a single string
      const combinedDateTimeString = `${formattedStartDate}T${req.body.startTime}:00`;
      // Create a JavaScript Date object in local time
      const localDateTime = new Date(combinedDateTimeString);
      // Convert to UTC
      endDateTimeInUTC = new Date(
        localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000,
      );
    }

    const updatedTaskData = await taskModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title || originalTaskData.title,
          description: req.body.description || originalTaskData.description,
          startDate: endDateTimeInUTC || originalTaskData.startDate,
        },
      },
      { new: true },
    );
    res.status(200).json({
      message: 'Task data has been updated',
      status: 200,
      task: updatedTaskData,
    });
  } catch (error) {
    next(error);
  }
};

//*** Update task status ***//
export const updateTaskStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.params.id) throw CreateError.BadRequest('Task id is not provided');
    const originalTaskData: ITask | null = await taskModel.findById(
      req.params.id,
    );
    if (!originalTaskData)
      throw CreateError.BadRequest(`No task found with ${req.params.id}`);
    if (originalTaskData.status === 'delete')
      CreateError.BadRequest('This task has been deleted');
    if (originalTaskData.user.toString() !== req.user._id.toString())
      throw CreateError.BadRequest(
        'You cannot have enough permission to updated the task',
      );
    if (!req.body.status) throw CreateError('Please provide status value');
    const statusValue: string = req.body.status;
    const checkStatuValues: string[] = isValidStatus(originalTaskData.status);
    console.log(checkStatuValues);
    if (!checkStatuValues.includes(statusValue))
      throw CreateError.BadRequest('Invalid status value');

    const updateTaskStatus = await taskModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: req.body.status },
        $push: {
          statusDetails: {
            statusName: req.body.status,
            statusTime: new Date(),
          },
        },
      },
      { new: true },
    );
    res.status(201).json({
      message: 'Task status has been changed',
      status: 200,
      task: updateTaskStatus,
    });
  } catch (error) {
    next(error);
  }
};

//*** Delete task ***//
export const deleteTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.params.id) throw CreateError.BadRequest('Task id is not provided');
    const originalTaskData: ITask | null = await taskModel.findById(
      req.params.id,
    );
    if (!originalTaskData)
      throw CreateError.BadRequest(`No task found with ${req.params.id}`);
    if (originalTaskData.status === 'delete')
      CreateError.BadRequest('This task has been deleted');
    if (originalTaskData.user.toString() !== req.user._id.toString())
      throw CreateError.BadRequest(
        'You cannot have enough permission to updated the task',
      );

    const checkStatuValues: string[] = isValidStatus(originalTaskData.status);
    if (!checkStatuValues.includes('delete'))
      throw CreateError.BadRequest('Opps! You cannot delete this task');
    const deletedTask = await taskModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: 'delete' },
        $push: {
          statusDetails: {
            statusName: 'delete',
            statusTime: new Date(),
          },
        },
      },
      { new: true },
    );
    res.status(201).json({
      message: 'Task has been deleted',
      status: 200,
      task: deletedTask,
    });
  } catch (error) {
    next(error);
  }
};
