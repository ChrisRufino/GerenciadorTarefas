import { TasksController } from "@/controllers/tasks-controller";
import { TasksStatusController } from "@/controllers/tasks-status-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticate";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const tasksRoutes = Router();
const tasksController = new TasksController();
const tasksStatusController = new TasksStatusController();

tasksRoutes.use(
  ensureAuthenticated,
  verifyUserAuthorization(["administrator"]),
);

tasksRoutes.post("/", tasksController.create);
tasksRoutes.get("/", tasksController.index);
tasksRoutes.patch("/:id/status", tasksStatusController.update);

export { tasksRoutes };
