import express from "express"
import { tryCatch } from "./utils.js";
import { getUser, login, logout, register, verify } from "./controllers/user.js";
import verifyToken from "./middlewares/verifyToken.js";

const publicRouter = express.Router();
const protectedRouter = express.Router();

publicRouter.post("/register", tryCatch(register));
publicRouter.post("/login", tryCatch(login));
publicRouter.post("/verify", tryCatch(verify))


protectedRouter.use(tryCatch(verifyToken))
protectedRouter
    .get("/user", tryCatch(getUser))
    .get("/logout", tryCatch(logout))

export {publicRouter, protectedRouter}