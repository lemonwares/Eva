-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "subTags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "categories_aliases_idx" ON "categories"("aliases");

-- CreateIndex
CREATE INDEX "categories_subTags_idx" ON "categories"("subTags");
