import mongoose from 'mongoose';
import ITask, { ITaskDetails } from '../interface/task.interface';

// Correct the typo in newStatusDetails
const newStatusDetails = new mongoose.Schema<ITaskDetails>({
  statusTime: { type: Date, default: new Date() },
  statusName: { type: String, required: [true, 'Status name required'] },
});

// Corrected TaskSchema
const TaskSchema = new mongoose.Schema<ITask>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String, required: [true, 'Task title is required'] },
    description: {
      type: String,
      required: [true, 'Task description is required'],
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['initialize', 'active', 'complete', 'overdue', 'cancel', 'delete'],
      default: 'initialize',
    },
    startDate: { type: Date, required: [true, 'Task start time is required'] },
    endDate: { type: Date },
    statusDetails: { type: [newStatusDetails], default: [] },
  },
  { timestamps: true },
);

//*** Create indexes for Task Schema ***//
TaskSchema.index({ user: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ title: 1 });
TaskSchema.index({ description: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);
