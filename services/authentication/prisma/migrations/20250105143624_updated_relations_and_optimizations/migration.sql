/*
  Warnings:

  - You are about to drop the column `subjectid` on the `Subjects` table. All the data in the column will be lost.
  - You are about to drop the column `subjectname` on the `Subjects` table. All the data in the column will be lost.
  - You are about to drop the `Examiners` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[subjectId]` on the table `Subjects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subjectId` to the `Subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectName` to the `Subjects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('NOT_STARTED', 'LOGGED_IN', 'TAKING_TEST', 'COMPLETED_TEST');

-- CreateEnum
CREATE TYPE "ExamSessionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- DropIndex
DROP INDEX "Subjects_subjectid_key";

-- DropIndex
DROP INDEX "Subjects_subjectname_idx";

-- AlterTable
ALTER TABLE "Subjects" DROP COLUMN "subjectid",
DROP COLUMN "subjectname",
ADD COLUMN     "subjectId" TEXT NOT NULL,
ADD COLUMN     "subjectName" VARCHAR(120) NOT NULL;

-- DropTable
DROP TABLE "Examiners";

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "candidatePicture" VARCHAR(200),
    "candidateId" VARCHAR(20) NOT NULL,
    "surname" VARCHAR(120) NOT NULL,
    "firstname" VARCHAR(100) NOT NULL,
    "othername" VARCHAR(100),
    "sessionId" TEXT NOT NULL,
    "campusId" VARCHAR(120),
    "seatNo" INTEGER NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSession" (
    "id" SERIAL NOT NULL,
    "sessionId" VARCHAR(100) NOT NULL,
    "sessionName" VARCHAR(100) NOT NULL,
    "examId" VARCHAR(100) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "status" "ExamSessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "organization" VARCHAR(100) NOT NULL,
    "examCode" VARCHAR(100) NOT NULL,
    "examName" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectCombination" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "subject1Id" VARCHAR(120) NOT NULL,
    "subject2Id" VARCHAR(120),
    "subject3Id" VARCHAR(120),
    "subject4Id" VARCHAR(120),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectCombination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSettings" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "numberOfGeneralQuestion" INTEGER NOT NULL,
    "numberOfSubjectsQueston" INTEGER NOT NULL,
    "generalSubjectId" TEXT NOT NULL,

    CONSTRAINT "ExamSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_candidateId_key" ON "Candidate"("candidateId");

-- CreateIndex
CREATE INDEX "Candidate_surname_firstname_idx" ON "Candidate"("surname", "firstname");

-- CreateIndex
CREATE INDEX "Candidate_sessionId_seatNo_idx" ON "Candidate"("sessionId", "seatNo");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSession_sessionId_key" ON "ExamSession"("sessionId");

-- CreateIndex
CREATE INDEX "ExamSession_examId_idx" ON "ExamSession"("examId");

-- CreateIndex
CREATE INDEX "ExamSession_examDate_status_idx" ON "ExamSession"("examDate", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_examCode_key" ON "Exam"("examCode");

-- CreateIndex
CREATE INDEX "Exam_organization_idx" ON "Exam"("organization");

-- CreateIndex
CREATE INDEX "Exam_examName_idx" ON "Exam"("examName");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectCombination_candidateId_key" ON "SubjectCombination"("candidateId");

-- CreateIndex
CREATE INDEX "SubjectCombination_candidateId_idx" ON "SubjectCombination"("candidateId");

-- CreateIndex
CREATE INDEX "SubjectCombination_subject1Id_idx" ON "SubjectCombination"("subject1Id");

-- CreateIndex
CREATE INDEX "SubjectCombination_subject2Id_idx" ON "SubjectCombination"("subject2Id");

-- CreateIndex
CREATE INDEX "SubjectCombination_subject3Id_idx" ON "SubjectCombination"("subject3Id");

-- CreateIndex
CREATE INDEX "SubjectCombination_subject4Id_idx" ON "SubjectCombination"("subject4Id");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSettings_sessionId_key" ON "ExamSettings"("sessionId");

-- CreateIndex
CREATE INDEX "ExamSettings_sessionId_idx" ON "ExamSettings"("sessionId");

-- CreateIndex
CREATE INDEX "ExamSettings_generalSubjectId_idx" ON "ExamSettings"("generalSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Subjects_subjectId_key" ON "Subjects"("subjectId");

-- CreateIndex
CREATE INDEX "Subjects_subjectName_idx" ON "Subjects"("subjectName");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ExamSession"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("examCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCombination" ADD CONSTRAINT "SubjectCombination_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCombination" ADD CONSTRAINT "SubjectCombination_subject1Id_fkey" FOREIGN KEY ("subject1Id") REFERENCES "Subjects"("subjectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCombination" ADD CONSTRAINT "SubjectCombination_subject2Id_fkey" FOREIGN KEY ("subject2Id") REFERENCES "Subjects"("subjectId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCombination" ADD CONSTRAINT "SubjectCombination_subject3Id_fkey" FOREIGN KEY ("subject3Id") REFERENCES "Subjects"("subjectId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCombination" ADD CONSTRAINT "SubjectCombination_subject4Id_fkey" FOREIGN KEY ("subject4Id") REFERENCES "Subjects"("subjectId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSettings" ADD CONSTRAINT "ExamSettings_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ExamSession"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSettings" ADD CONSTRAINT "ExamSettings_generalSubjectId_fkey" FOREIGN KEY ("generalSubjectId") REFERENCES "Subjects"("subjectId") ON DELETE RESTRICT ON UPDATE CASCADE;
