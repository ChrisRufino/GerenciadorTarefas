import { ensureAuthenticated } from "@/middlewares/ensure-authenticate";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

import { TasksLogController } from "@/controllers/tasks-log-controller";

const tasksLogsRoutes = Router();
const taskslogsController = new TasksLogController();

tasksLogsRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["administrator"]),
  taskslogsController.create,
);

export { tasksLogsRoutes };
