import express from "express";
import createHttpError from "http-errors";
import userModel from "./model.js";
import q2m from "query-to-mongo";
import { adminOnlyMiddleware } from "../../lib/adminOnly.js";
import { JWTAuthMiddleware } from "../../lib/jwtAuth.js";
import { createAccessToken } from "../../lib/tools.js";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    console.log(req.body);
    const newUser = new userModel(req.body);
    const { _id } = await newUser.save();
    const payload = { _id: newUser._id };
    const accessToken = await createAccessToken(payload);
    res.send({ accessToken });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Bad credentials!"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id).populate({
      path: "likes",
      model: "Workouts",
      select: "title",
    });
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `user with id ${req.user._id} does not exist!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.get("/me/myExe", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id).populate({
      path: "likes",
      model: "Workouts",
      select: "title",
    });
    if (user) {
      res.send(user);
      console.log(user);
    } else {
      next(
        createHttpError(404, `user with id ${req.user._id} does not exist!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(
        createHttpError(404, `user with id ${req.user._id} does not exist!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.put(
  "/me/likes/:workoutId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        { $push: { likes: req.params.workoutId } },
        { new: true }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(
          createHttpError(404, `User with id ${req.user._id} does not exist!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
usersRouter.delete(
  "/me/likes/:workoutId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { likes: req.params.workoutId } },
        { new: true }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(
          createHttpError(404, `User with id ${req.user._id} does not exist!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
// usersRouter.post("/me/image", async (req,res,next) => {
//   const
// })

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.user._id);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `user with id ${req.user._id} does not exist!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      mongoQuery = q2m(req.query);
      const total = await userModel.countDocuments(mongoQuery.criteria);
      const users = await userModel
        .find(mongoQuery.criteria, mongoQuery.options.fields)
        .limit(mongoQuery.options.limit)
        .skip(mongoQuery.options.skip)
        .sort(mongoQuery.options.sort);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.put("/:userId", adminOnlyMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(
        createHttpError(404, `user with id ${req.user._id} does not exist!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", adminOnlyMiddleware, async (req, res, next) => {
  try {
    const deletedUser = userModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `user with id ${req.user._id} does not exist!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
