import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { z } from "zod";

class teamsMember {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      userId: z.int(),
      teamId: z.int(),
    });

    const { userId, teamId } = bodySchema.parse(request.body);

    const membersTeam = await prisma.team_members.create({
      data: {
        userId,
        teamId,
      },
    });

    return response.status(201).json(membersTeam);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.coerce.number().int(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.team_members.delete({
      where: { id },
    });

    return response.status(204).json();
  }
}

export { teamsMember };
