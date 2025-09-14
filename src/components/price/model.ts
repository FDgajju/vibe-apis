import { Schema, model } from "mongoose";
import { PRICE_OF } from "../../constants/constant";
import { MODEL_NAMES } from "../../constants";

export type PriceT = {
  city: string;
  priceOf: string;
  amount: number;
}

const PriceSchema = new Schema<PriceT>(
  {
    city: {
      type: String,
      required: [true, "Specify the city name to set the price."],
    },
    priceOf: {
      type: String,
      enum: Object.values(PRICE_OF),
    },
    amount: {
      type: Number,
      required: [true, "Specify the city name to set the price."],
    },
  },
  { timestamps: true }
);

export const Price = model<PriceT>(MODEL_NAMES.PRICE, PriceSchema);