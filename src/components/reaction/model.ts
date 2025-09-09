import { Schema, model } from "mongoose";
import { REACTIONS } from "../../constants/constant";
import { MODEL_NAMES } from "../../constants";

interface IReaction {
  by: string | Schema.Types.ObjectId;
  post?: string | Schema.Types.ObjectId;
  comment?: string | Schema.Types.ObjectId;
  reaction: (typeof REACTIONS)[number];
}

const reactionSchema = new Schema<IReaction>(
  {
    by: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: [true, "Reaction must belong to a user"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.POST,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.COMMENT,
    },
    reaction: {
      type: String,
      required: [true, "Reaction must have a type"],
      enum: REACTIONS,
    },
  },
  { timestamps: true }
);

reactionSchema.index(
  { by: 1, post: 1 },
  { unique: true, partialFilterExpression: { post: { $exists: true } } }
);
reactionSchema.index(
  { by: 1, comment: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } }
);

export const Reaction = model<IReaction>(MODEL_NAMES.REACTION, reactionSchema);



