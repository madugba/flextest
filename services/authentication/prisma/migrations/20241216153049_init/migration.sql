-- CreateTable
CREATE TABLE "Examiners" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Examiners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subjects" (
    "id" SERIAL NOT NULL,
    "subjectid" TEXT NOT NULL,
    "subjectname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Examiners_userId_key" ON "Examiners"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Examiners_email_key" ON "Examiners"("email");

-- CreateIndex
CREATE INDEX "Examiners_name_idx" ON "Examiners"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subjects_subjectid_key" ON "Subjects"("subjectid");

-- CreateIndex
CREATE INDEX "Subjects_subjectname_idx" ON "Subjects"("subjectname");
