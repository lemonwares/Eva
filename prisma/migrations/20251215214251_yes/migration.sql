-- CreateTable
CREATE TABLE "booking_listings" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "booking_listings_booking_id_idx" ON "booking_listings"("booking_id");

-- CreateIndex
CREATE INDEX "booking_listings_listing_id_idx" ON "booking_listings"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_listings_booking_id_listing_id_key" ON "booking_listings"("booking_id", "listing_id");

-- AddForeignKey
ALTER TABLE "booking_listings" ADD CONSTRAINT "booking_listings_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_listings" ADD CONSTRAINT "booking_listings_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
