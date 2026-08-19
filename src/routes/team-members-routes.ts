import { teamsMember } from "@/controllers/team_members";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticate";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const membersRoutes = Router();
const memberController = new teamsMember();

membersRoutes.use(
  ensureAuthenticated,
  verifyUserAuthorization(["administrator"]),
);

membersRoutes.post("/", memberController.create);
membersRoutes.delete("/:id", memberController.delete);

export { membersRoutes };
