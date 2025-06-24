/*
  Warnings:

  - You are about to drop the `ExportCheckListItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImportCheckListItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExportCheckListItem" DROP CONSTRAINT "ExportCheckListItem_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "ImportCheckListItem" DROP CONSTRAINT "ImportCheckListItem_ticketId_fkey";

-- DropTable
DROP TABLE "ExportCheckListItem";

-- DropTable
DROP TABLE "ImportCheckListItem";

-- CreateTable
CREATE TABLE "ImportCheckListItems" (
    "id" SERIAL NOT NULL,
    "checkItem1" TEXT NOT NULL,
    "checkItem2" TEXT NOT NULL,
    "checkItem3" TEXT NOT NULL,
    "checkItem4" TEXT NOT NULL,
    "checkItem5" TEXT NOT NULL,
    "checkItemStatus" BOOLEAN NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "ImportCheckListItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportCheckListItems" (
    "id" SERIAL NOT NULL,
    "checkItem" TEXT NOT NULL,
    "checkItem1" TEXT NOT NULL,
    "checkItem2" TEXT NOT NULL,
    "checkItem3" TEXT NOT NULL,
    "checkItem4" TEXT NOT NULL,
    "checkItem5" TEXT NOT NULL,
    "checkItemStatus" BOOLEAN NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "ExportCheckListItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImportCheckListItems" ADD CONSTRAINT "ImportCheckListItems_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportCheckListItems" ADD CONSTRAINT "ExportCheckListItems_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
