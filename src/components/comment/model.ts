import { Schema, model } from "mongoose";
import { MODEL_NAMES } from "../../constants";

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    by: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.POST,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.COMMENT,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
commentSchema.index({ parentComment: 1 });

commentSchema.pre("save", function (next) {
  if (this.post && this.parentComment) {
    next(new Error("Comment cannot be for both a post and a reply"));
  } else if (!this.post && !this.parentComment) {
    next(new Error("Comment must be for either a post or a reply"));
  } else {
    next();
  }
});

commentSchema.virtual("children_comments", {
  ref: MODEL_NAMES.COMMENT,
  localField: "_id",
  foreignField: "parentComment",
  justOne: false,
});

export const Comment = model(MODEL_NAMES.COMMENT, commentSchema);
