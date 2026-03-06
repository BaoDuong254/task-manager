/*
  Warnings:

  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `taskId` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,projectId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Task" DROP CONSTRAINT "Task_pkey",
DROP COLUMN "taskId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Task_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Task_id_projectId_key" ON "Task"("id", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
