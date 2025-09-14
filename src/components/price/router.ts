import { Router } from "express";
import {
  createPrice,
  getAllPrices,
  getPrice,
  updatePrice,
  deletePrice,
} from "./controller";
import { inputValidation } from "../../middlewares";
import { priceSchema } from "./validator";
import { catchHandler } from "../../utils";
import { authenticate, authorization } from "../../middlewares/auth";
import { USER_ROLES } from "../../constants/constant";

const priceRouter = Router();

priceRouter.use(
  catchHandler(authenticate),
  authorization(USER_ROLES.ADMIN, USER_ROLES.MANAGER)
);

priceRouter.post("/", inputValidation(priceSchema), createPrice);
priceRouter.get("/", getAllPrices);

priceRouter.get("/:id", getPrice);
priceRouter.patch("/:id", inputValidation(priceSchema.partial()), updatePrice);
priceRouter.delete("/:id", deletePrice);

export default priceRouter;
