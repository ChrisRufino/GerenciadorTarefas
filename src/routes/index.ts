import { Router } from "express";
import { sessionsRoutes } from "./sessions-routes";
import { tasksHistoryRoutes } from "./tasks-history-routes";
import { tasksLogsRoutes } from "./tasks-logs-routes";
import { tasksRoutes } from "./tasks-routes";
import { listMembers, membersRoutes } from "./team-members-routes";
import { teamsRoutes } from "./teams-routes";
import { usersRoutes } from "./users-routes";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/tasks", tasksRoutes);
routes.use("/teams", teamsRoutes);
routes.use("/members", membersRoutes);
routes.use("/membersList", listMembers);
routes.use("/tasks-log", tasksLogsRoutes);
routes.use("/tasks-history", tasksHistoryRoutes);

export { routes };
