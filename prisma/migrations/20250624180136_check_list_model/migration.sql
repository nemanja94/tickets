/*
  Warnings:

  - You are about to drop the `ExitingCheckList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExitingCheckList" DROP CONSTRAINT "ExitingCheckList_modelId_fkey";

-- DropForeignKey
ALTER TABLE "ExitingCheckList" DROP CONSTRAINT "ExitingCheckList_userId_fkey";

-- DropTable
DROP TABLE "ExitingCheckList";

-- CreateTable
CREATE TABLE "ImportCheckListItem" (
    "id" SERIAL NOT NULL,
    "checkItem" TEXT NOT NULL,
    "checkItemStatus" BOOLEAN NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "ImportCheckListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportCheckListItem" (
    "id" SERIAL NOT NULL,
    "checkItem" TEXT NOT NULL,
    "checkItemStatus" BOOLEAN NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "ExportCheckListItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImportCheckListItem" ADD CONSTRAINT "ImportCheckListItem_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportCheckListItem" ADD CONSTRAINT "ExportCheckListItem_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
