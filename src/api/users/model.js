import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: {
      type: String,
      required: false,
      default:
        "https://i.pinimg.com/736x/b7/21/57/b72157473ae510c74e7a96ccb8bd0e38.jpg",
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
    likes: [{ type: Schema.Types.ObjectId, ref: "Workouts", required: false }],
  },
  { timestamps: true }
);

usersSchema.pre("save", async function (next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    const plainPW = currentUser.password;
    const hash = await bcrypt.hash(plainPW, 10);
    currentUser.password = hash;
  }
  next();
});

usersSchema.methods.toJSON = function () {
  const userDocument = this;
  const user = userDocument.toObject();
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  return user;
};

usersSchema.static("checkCredentials", async function (email, password) {
  console.log(email, password);
  const user = await this.findOne({ email });
  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  }
});

export default model("User", usersSchema);
