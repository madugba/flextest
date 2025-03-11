/*
  Warnings:

  - You are about to drop the column `numberOfSubjectsQueston` on the `ExamSettings` table. All the data in the column will be lost.
  - You are about to drop the `SubjectCombination` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `numberOfSubjectsQuestion` to the `ExamSettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubjectCombination" DROP CONSTRAINT "SubjectCombination_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectCombination" DROP CONSTRAINT "SubjectCombination_subject1Id_fkey";

-- DropForeignKey
ALTER TABLE "SubjectCombination" DROP CONSTRAINT "SubjectCombination_subject2Id_fkey";

-- DropForeignKey
ALTER TABLE "SubjectCombination" DROP CONSTRAINT "SubjectCombination_subject3Id_fkey";

-- DropForeignKey
ALTER TABLE "SubjectCombination" DROP CONSTRAINT "SubjectCombination_subject4Id_fkey";

-- DropIndex
DROP INDEX "Subjects_subjectName_idx";

-- AlterTable
ALTER TABLE "ExamSettings" DROP COLUMN "numberOfSubjectsQueston",
ADD COLUMN     "numberOfSubjectsQuestion" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SubjectCombination";

-- CreateTable
CREATE TABLE "CandidateSubject" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "CandidateSubject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CandidateSubject_candidateId_idx" ON "CandidateSubject"("candidateId");

-- CreateIndex
CREATE INDEX "CandidateSubject_subjectId_idx" ON "CandidateSubject"("subjectId");

-- CreateIndex
CREATE INDEX "CandidateSubject_sessionId_idx" ON "CandidateSubject"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateSubject_candidateId_subjectId_sessionId_key" ON "CandidateSubject"("candidateId", "subjectId", "sessionId");

-- AddForeignKey
ALTER TABLE "CandidateSubject" ADD CONSTRAINT "CandidateSubject_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSubject" ADD CONSTRAINT "CandidateSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSubject" ADD CONSTRAINT "CandidateSubject_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ExamSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;
