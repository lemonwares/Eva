/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `providers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "providers" ADD COLUMN     "slug" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "providers_slug_key" ON "providers"("slug");

-- CreateIndex
CREATE INDEX "providers_slug_idx" ON "providers"("slug");

-- CreateIndex
CREATE INDEX "providers_tags_idx" ON "providers"("tags");
