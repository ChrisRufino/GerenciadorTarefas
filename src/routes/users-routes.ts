import { Router } from "express";

import { UsersController } from "@/controllers/users-controller";

const usersRoutes = Router();

const userController = new UsersController();

usersRoutes.get("/", userController.create);

export { usersRoutes };
