/** @format */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "morgan";
import helmet from "helmet";
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use(helmet());

const port = process.env.PORT || 7070;

app.listen(port, () => console.log(`app listening on port:${port}`));
