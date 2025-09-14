import { z } from "zod";
import { PRICE_OF } from "../../constants/constant";

export const priceSchema = z.object({
  body: z.object({
    city: z.string().nonempty("City name is required"),
    priceOf: z.enum(Object.values(PRICE_OF) as [string, ...string[]]),
    amount: z.number(),
  }),
});
