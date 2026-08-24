import { TasksController } from "@/controllers/tasks-controller";
import { TasksStatusController } from "@/controllers/tasks-status-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticate";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const tasksRoutes = Router();
const tasksController = new TasksController();
const tasksStatusController = new TasksStatusController();

tasksRoutes.use(ensureAuthenticated);

tasksRoutes.post(
  "/",
  verifyUserAuthorization(["administrator"]),
  tasksController.create,
);
tasksRoutes.get(
  "/",
  verifyUserAuthorization(["administrator", "member"]),
  tasksController.index,
);
tasksRoutes.patch(
  "/:id/assign",
  verifyUserAuthorization(["administrator"]),
  tasksController.assign,
);
tasksRoutes.patch(
  "/:id/status",
  verifyUserAuthorization(["administrator"]),
  tasksStatusController.update,
);
tasksRoutes.delete(
  "/:id",
  verifyUserAuthorization(["administrator"]),
  tasksController.delete,
);

export { tasksRoutes };
