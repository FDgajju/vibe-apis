import { Router } from "express";
import { catchHandler } from "../../utils";
import { signIn, signUp } from "./controller";
import { inputValidation } from "../../middlewares";
import { signinSchema, signupSchema } from "./validatory";

const authRouter = Router();

authRouter.post("/signup", inputValidation(signupSchema), catchHandler(signUp));
authRouter.post("/signin", inputValidation(signinSchema), catchHandler(signIn));

export default authRouter;
