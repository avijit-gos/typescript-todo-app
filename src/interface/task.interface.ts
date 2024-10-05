import mongoose from 'mongoose';

interface ITask {
  readonly _id: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  readonly user: mongoose.Schema.Types.ObjectId;
  status: string;
  endDate: Date;
  startDate: Date;
  statusDetails: ITaskDetails[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITaskDetails {
  statusTime: Date;
  statusName: string;
}

export default ITask;
