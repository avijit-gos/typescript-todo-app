/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from 'morgan';
import helmet from 'helmet';
import CreateError from 'http-errors';
import fileUpload from 'express-fileupload';
import databaseInit from './config/database.config';
dotenv.config();
databaseInit();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger('dev'));
app.use(helmet());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
);

import UserRoute from './routes/user.routes';
app.use('/api/v1/user', UserRoute);

import TaskRoute from './routes/task.routes';
app.use('/api/v1/task', TaskRoute);

app.use(async (req: Request, res: Response, next: NextFunction) => {
  next(CreateError.NotFound('Page not found'));
});
// Error message
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const port = process.env.PORT || 7070;

app.listen(port, () => console.log(`app listening on port:${port}`));
