import { Router } from "express";
import { sessionsRoutes } from "./sessions-routes";
import { tasksRoutes } from "./tasks-routes";
import { teamsRoutes } from "./teams-routes";
import { usersRoutes } from "./users-routes";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/tasks", tasksRoutes);
routes.use("/teams", teamsRoutes);
export { routes };
