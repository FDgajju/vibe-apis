import { Schema, model } from "mongoose";
import { MODEL_NAMES } from "../../constants";

interface IConnection extends Document {
  by: Schema.Types.ObjectId;
  followTo: Schema.Types.ObjectId;
  createdAt: Date;
}

const connectionSchema = new Schema<IConnection>(
  {
    by: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: [true, "Follow must have a follower"],
    },
    followTo: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: [true, "Follow must have a user being followed"],
    },
  },
  { timestamps: true }
);

connectionSchema.index({ by: 1, followTo: 1 }, { unique: true });

const Connection = model(MODEL_NAMES.FOLLOW, connectionSchema);
export default Connection;
