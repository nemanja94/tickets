-- CreateTable
CREATE TABLE "ExitingCheckList" (
    "id" SERIAL NOT NULL,
    "checkItem" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "modelId" INTEGER NOT NULL,

    CONSTRAINT "ExitingCheckList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExitingCheckList" ADD CONSTRAINT "ExitingCheckList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExitingCheckList" ADD CONSTRAINT "ExitingCheckList_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
