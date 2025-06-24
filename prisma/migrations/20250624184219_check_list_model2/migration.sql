/*
  Warnings:

  - You are about to drop the `ExportCheckListItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImportCheckListItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `exportCheckItems` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importCheckitems` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExportCheckListItems" DROP CONSTRAINT "ExportCheckListItems_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "ImportCheckListItems" DROP CONSTRAINT "ImportCheckListItems_ticketId_fkey";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "exportCheckItems" JSONB NOT NULL,
ADD COLUMN     "importCheckitems" JSONB NOT NULL;

-- DropTable
DROP TABLE "ExportCheckListItems";

-- DropTable
DROP TABLE "ImportCheckListItems";
