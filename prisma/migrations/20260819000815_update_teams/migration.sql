/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "teams_description_key" ON "teams"("description");
