"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Trash2, Plus, PoundSterling, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { type OnboardingData, type ListingDraft, inputCls } from "../types";

const ImageUpload = dynamic(
  () =>
    import("@/components/ui/ImageUpload").then((mod) => ({
      default: mod.default,
    })),
  {
    loading: () => (
      <div className="w-full h-32 bg-gray-100 animate-pulse rounded-xl" />
    ),
    ssr: false,
  },
);

const MultiImageUpload = dynamic(
  () =>
    import("@/components/ui/ImageUpload").then((mod) => ({
      default: mod.MultiImageUpload,
    })),
  {
    loading: () => (
      <div className="w-full h-32 bg-gray-100 animate-pulse rounded-xl" />
    ),
    ssr: false,
  },
);

interface Props {
  formData: OnboardingData;
  listingDraft: ListingDraft;
  handleDraftChange: (updates: Partial<ListingDraft>) => void;
  handleAddListing: () => void;
  handleRemoveListing: (idx: number) => void;
}

export function ListingsStep({
  formData,
  listingDraft,
  handleDraftChange,
  handleAddListing,
  handleRemoveListing,
}: Props) {
  const canAdd =
    listingDraft.headline.trim() &&
    listingDraft.price &&
    listingDraft.price > 0 &&
    listingDraft.timeEstimate.trim() &&
    listingDraft.coverImageUrl.trim() &&
    listingDraft.longDescription.trim();

  return (
    <div className="space-y-8">
      {/* Existing listings */}
      {formData.listings.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">
            Your Services ({formData.listings.length})
          </h4>
          {formData.listings.map((listing, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50"
            >
              {listing.coverImageUrl && (
                <Image
                  src={listing.coverImageUrl}
                  alt={listing.headline}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {listing.headline}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {formatCurrency(listing.price ?? 0)} · {listing.timeEstimate}
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {listing.longDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveListing(idx)}
                className="text-red-400 hover:text-red-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new listing form */}
      <div className="space-y-5 p-5 border-2 border-dashed border-gray-200 rounded-xl">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add a Service
        </h4>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Service Name
          </label>
          <input
            type="text"
            value={listingDraft.headline}
            onChange={(e) => handleDraftChange({ headline: e.target.value })}
            placeholder="e.g., Full Day Wedding Photography"
            className={inputCls()}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Description
          </label>
          <textarea
            value={listingDraft.longDescription}
            onChange={(e) =>
              handleDraftChange({ longDescription: e.target.value })
            }
            placeholder="Describe what's included in this service…"
            rows={3}
            maxLength={500}
            className={inputCls()}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {listingDraft.longDescription.length}/500
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Price (£)
            </label>
            <div className="relative">
              <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                value={listingDraft.price ?? ""}
                onChange={(e) =>
                  handleDraftChange({
                    price: e.target.value ? Number(e.target.value) : null,
                  })
                }
                placeholder="e.g., 500"
                className={`${inputCls()} pl-9`}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Time Estimate
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={listingDraft.timeEstimate}
                onChange={(e) =>
                  handleDraftChange({ timeEstimate: e.target.value })
                }
                placeholder="e.g., 8 hours"
                className={`${inputCls()} pl-9`}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Cover Image
          </label>
          <ImageUpload
            value={listingDraft.coverImageUrl}
            onChange={(url: string) =>
              handleDraftChange({ coverImageUrl: url })
            }
            folder="vendor-listings"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Gallery Images (optional)
          </label>
          <MultiImageUpload
            values={listingDraft.galleryUrls}
            onChange={(urls: string[]) =>
              handleDraftChange({ galleryUrls: urls })
            }
            maxImages={6}
            folder="vendor-listing-gallery"
          />
        </div>

        <button
          type="button"
          onClick={handleAddListing}
          disabled={!canAdd}
          className="w-full py-3 rounded-xl font-medium text-sm bg-[#0097b2] text-white hover:bg-[#007f96] disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
        >
          Add Service
        </button>
      </div>
    </div>
  );
}
