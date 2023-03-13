import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
  badRequestHandler,
  genericServerErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";

import usersRouter from "./api/users/index.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import workRouter from "./api/work/index.js";
import exercisesRouter from "./api/exercises/index.js";

dotenv.config();
const server = express();
const port = process.env.PORT || 3002;

server.use(cors());
server.use(express.json());

server.use("/users", usersRouter);
server.use("/workouts", workRouter);
server.use("/exercises", exercisesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericServerErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
