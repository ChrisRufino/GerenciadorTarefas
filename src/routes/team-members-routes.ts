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

const listMembers = Router();

listMembers.use(
  ensureAuthenticated,
  verifyUserAuthorization(["administrator", "member"]),
);

membersRoutes.post("/", memberController.create);
membersRoutes.delete("/:id", memberController.delete);
listMembers.get("/", memberController.index);

export { listMembers, membersRoutes };
