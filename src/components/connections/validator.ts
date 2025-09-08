import { z } from "zod";

export const createConnectionsSchema = z.object({
  body: z.object({
    followTo: z.string().nonempty("User to follow is required"),
  }),
});
