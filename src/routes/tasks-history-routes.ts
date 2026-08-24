import { ensureAuthenticated } from "@/middlewares/ensure-authenticate";
import { Router } from "express";

import { TasksHistory } from "@/controllers/tasks-history";

const tasksHistoryRoutes = Router();
const tasksHistory = new TasksHistory();

tasksHistoryRoutes.get("/", ensureAuthenticated, tasksHistory.index);

export { tasksHistoryRoutes };
