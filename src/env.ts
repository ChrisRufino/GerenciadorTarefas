import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  PORT: z.string().transform((value) => parseInt(value, 10)),
});

export const env = envSchema.parse(process.env);
