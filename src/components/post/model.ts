import { Schema, model } from "mongoose";
import { MODEL_NAMES } from "../../constants";
import { CITY_NAMES } from "../../constants/randomCityName";

const postSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    media: [{ type: String, ref: MODEL_NAMES.FILE }],
    author: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
    },
    location: {
      type: String,
      default: CITY_NAMES[Math.ceil(Math.random() * CITY_NAMES.length)],
    },
    isPrivate: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictPopulate: false,
  }
);

postSchema.index({ author: 1 }, { unique: false });
postSchema.index({ location: 1 }, { unique: false });

postSchema.virtual("comments", {
  ref: MODEL_NAMES.COMMENT,
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

postSchema.virtual("reactions", {
  ref: MODEL_NAMES.REACTION,
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

export const Post = model(MODEL_NAMES.POST, postSchema);
