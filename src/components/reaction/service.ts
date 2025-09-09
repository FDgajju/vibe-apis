import type { AnyType } from "../../types/globalTypes";
import { Reaction } from "./model";

export const reactionCount = async (filter: AnyType) => {
  try {
    console.log(filter);
    const data = await Reaction.aggregate([
      { $match: filter },
      { $group: { _id: "$reaction", count: { $sum: 1 } } },
    ]);

    return { status: true, data, error: null };
  } catch (error) {
    return { status: true, data: null, error };
  }
};
