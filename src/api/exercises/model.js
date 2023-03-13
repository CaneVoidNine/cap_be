import mongoose from "mongoose";

const { Schema, model } = mongoose;

const exerciseSchema = new Schema(
  {
    title: { type: String, required: true },
    info: { type: String, required: false, default: "No info addded" },
    image: {
      type: String,
      required: false,
      default:
        "https://media.istockphoto.com/id/1035561592/vector/vector-design-element-for-the-fitness-center.jpg?s=612x612&w=0&k=20&c=k3yyyEcqeivby9iE7gZIk33PAjtDqNsdEdYiMjw7qsM=",
    },
    sets: { type: Number, required: false },
    time: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

export default model("Exercises", exerciseSchema);
