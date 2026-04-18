/*
  Warnings:

  - The values [IN_TRANSIT,FAILED] on the enum `PayoutStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `arrival_date` on the `payouts` table. All the data in the column will be lost.
  - You are about to drop the column `failure_reason` on the `payouts` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `payouts` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_account_id` on the `payouts` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_payout_id` on the `payouts` table. All the data in the column will be lost.
  - Added the required column `account_name` to the `payouts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_number` to the `payouts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_name` to the `payouts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PayoutStatus_new" AS ENUM ('PENDING', 'APPROVED', 'PROCESSING', 'PAID', 'REJECTED', 'CANCELLED');
ALTER TABLE "public"."payouts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payouts" ALTER COLUMN "status" TYPE "PayoutStatus_new" USING ("status"::text::"PayoutStatus_new");
ALTER TYPE "PayoutStatus" RENAME TO "PayoutStatus_old";
ALTER TYPE "PayoutStatus_new" RENAME TO "PayoutStatus";
DROP TYPE "public"."PayoutStatus_old";
ALTER TABLE "payouts" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropIndex
DROP INDEX "payouts_stripe_payout_id_idx";

-- DropIndex
DROP INDEX "payouts_stripe_payout_id_key";

-- AlterTable
ALTER TABLE "payouts" DROP COLUMN "arrival_date",
DROP COLUMN "failure_reason",
DROP COLUMN "metadata",
DROP COLUMN "stripe_account_id",
DROP COLUMN "stripe_payout_id",
ADD COLUMN     "account_name" TEXT NOT NULL,
ADD COLUMN     "account_number" TEXT NOT NULL,
ADD COLUMN     "bank_name" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "processed_at" TIMESTAMP(3),
ADD COLUMN     "processed_by" TEXT,
ADD COLUMN     "rejected_reason" TEXT,
ADD COLUMN     "sort_code" TEXT;

-- CreateTable
CREATE TABLE "platform_settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("key")
);

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
