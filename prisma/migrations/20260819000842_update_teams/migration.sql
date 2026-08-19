/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "teams_description_key";

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");
