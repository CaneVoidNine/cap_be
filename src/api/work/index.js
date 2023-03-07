import express from "express";
import WorkModel from "./model.js";
import createHttpError from "http-errors";

const workRouter = express.Router();

// POST

workRouter.post("/", async (req, res, next) => {
  try {
    const newWork = new WorkModel(req.body);
    const { _id } = await newWork.save();
  } catch (error) {
    next(error);
  }
});

// GET

workRouter.get("/", async (req, res, next) => {
  try {
    const workouts = await WorkModel.find();
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

workRouter.delete("workoutId", async (req, res, next) => {
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
