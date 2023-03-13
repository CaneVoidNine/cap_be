import express from "express";
import exercisesModel from "./model.js";
import createHttpError from "http-errors";

const exercisesRouter = express.Router();

// POST

exercisesRouter.post("/", async (req, res, next) => {
  try {
    const newExercises = new exercisesModel(req.body);
    const { _id } = await newExercises.save();
  } catch (error) {
    next(error);
  }
});

// GET

exercisesRouter.get("/", async (req, res, next) => {
  try {
    const exercises = await exercisesModel.find();
    res.send(exercises);
  } catch (error) {
    next(error);
  }
});

// GET BY ID

exercisesRouter.get("/:exercisesId", async (req, res, next) => {
  try {
    const exercises = await exercisesModel.findById(req.params.exercisesoutId);
    if (exercises) {
      res.send(exercises);
    } else {
      next(
        createHttpError(
          404,
          `exercisesout with id ${req.params.exercisesId} doesnt exist!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//PUT

exercisesRouter.put("/:exercisesId", async (req, res, next) => {
  try {
    const updatedexercises = await exercisesModel.findByIdAndUpdate(
      req.params.exercisesId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedexercises) {
      res.send(updatedexercises);
    } else {
      next(
        createHttpError(
          404,
          `exercisesout with id ${req.params.exercisesId} doesnt exist!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

// DELETE

exercisesRouter.delete("/:exercisesId", async (req, res, next) => {
  try {
    const deletedexercisesout = await exercisesModel.findByIdAndDelete(
      req.params.exercisesId
    );
    if (deletedexercisesout) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `exercisesout with id ${req.params.exercisesId} doesnt exist!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default exercisesRouter;
