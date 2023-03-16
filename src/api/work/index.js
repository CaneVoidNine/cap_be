import express from "express";
import WorkModel from "./model.js";
import createHttpError from "http-errors";
import { cloudinaryUpload } from "../utils/upload.js";

const workRouter = express.Router();

// POST

workRouter.post("/", cloudinaryUpload, async (req, res, next) => {
  try {
    console.log(req.body);
    const newWork = new WorkModel({
      title: req.body.title,
      image: req.file.path,
      info: req.body.info,
    });
    const { _id } = await newWork.save();
    if ({ _id }) {
      res.status(200).send();
    }
  } catch (error) {
    next(error);
  }
});

// GET

workRouter.get("/", async (req, res, next) => {
  try {
    const workouts = await WorkModel.find().populate({
      path: "exercises",
      model: "Exercises",
      select: "title",
    });
    res.send(workouts);
  } catch (error) {
    next(error);
  }
});

// GET BY ID

workRouter.get("/:workoutId", async (req, res, next) => {
  try {
    const workout = await WorkModel.findById(req.params.workoutId);
    if (workout) {
      res.send(workout);
    } else {
      next(
        createHttpError(
          404,
          `Workout with id ${req.params.workoutId} doesnt exist!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//PUT

workRouter.put("/:workoutId", async (req, res, next) => {
  try {
    const updatedWorkout = await WorkModel.findByIdAndUpdate(
      req.params.workoutId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedWorkout) {
      res.send(updatedWorkout);
    } else {
      next(
        createHttpError(
          404,
          `Workout with id ${req.params.workoutId} doesnt exist!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

// DELETE

workRouter.delete("/:workoutId", async (req, res, next) => {
  try {
    const deletedWorkout = await WorkModel.findByIdAndDelete(
      req.params.workoutId
    );
    if (deletedWorkout) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Workout with id ${req.params.workoutId} doesnt exist!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default workRouter;
