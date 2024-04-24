import mongoose, { Schema, Document } from "mongoose";

interface ITodo extends Document {
  todo: string;
}

const TodoSchema: Schema = new Schema(
  {
    todo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITodo>("Assignment_AbdulAzeez", TodoSchema);
