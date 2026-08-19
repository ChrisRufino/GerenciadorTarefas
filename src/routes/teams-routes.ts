import { teamsController } from "@/controllers/teams-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticate";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const teamsRoutes = Router();
const teamController = new teamsController();

teamsRoutes.use(
  ensureAuthenticated,
  verifyUserAuthorization(["administrator"]),
);

teamsRoutes.post("/", teamController.create);
teamsRoutes.get("/", teamController.index);

export { teamsRoutes };
