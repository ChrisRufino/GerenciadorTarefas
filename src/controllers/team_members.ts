import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod";

class TeamMembers {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
    });

    const { name, description } = bodySchema.parse(request.body);

    const sameName = await prisma.teams.findUnique({
      where: {
        name,
      },
    });

    if (sameName) {
      throw new AppError("Teams already in use", 409);
    }

    const teams = await prisma.teams.create({
      data: {
        name,
        description,
      },
    });

    return response.status(201).json(teams);
  }
}
