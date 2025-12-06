"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Modal from "@/components/admin/Modal";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";

interface Provider {
  id: string;
  businessName: string;
  description: string | null;
  address: string | null;
  postcode: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  status: string;
  isVerified: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  averageRating: number | null;
  reviewCount: number;
  priceFrom: number | null;
  createdAt: string;
  serviceRadius: number | null;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  subcategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
  city: {
    id: string;
    name: string;
  } | null;
  _count: {
    reviews: number;
    inquiries: number;
    bookings: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500";
    case "PENDING":
      return "bg-amber-500";
    case "SUSPENDED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getAvatarColors = (name: string) => {
  const colors = [
    "from-green-400 to-emerald-500",
    "from-orange-400 to-red-500",
    "from-purple-400 to-pink-500",
    "from-blue-400 to-indigo-500",
    "from-amber-400 to-orange-500",
    "from-pink-400 to-rose-500",
  ];
  return colors[name.charCodeAt(0) % colors.length];
};

const getInitials = (name: string) => {
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// View Modal
interface ViewVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  onAction: (provider: Provider, action: string) => void;
  onEdit: (provider: Provider) => void;
}

export function ViewVendorModal({
  isOpen,
  onClose,
  provider,
  onAction,
  onEdit,
}: ViewVendorModalProps) {
  const { darkMode, textPrimary, textSecondary, textMuted } = useAdminTheme();

  if (!provider) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vendor Details" size="xl">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-16 h-16 rounded-xl bg-linear-to-br ${getAvatarColors(
              provider.businessName
            )} flex items-center justify-center text-white font-bold text-xl`}
          >
            {getInitials(provider.businessName)}
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-semibold ${textPrimary}`}>
              {provider.businessName}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                  provider.status
                )}`}
              >
                {provider.status}
              </span>
              {provider.isVerified && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                  Verified
                </span>
              )}
              {provider.isFeatured && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            className={`p-4 rounded-xl ${
              darkMode ? "bg-white/5" : "bg-gray-50"
            }`}
          >
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {provider._count.bookings}
            </p>
            <p className={`text-sm ${textMuted}`}>Bookings</p>
          </div>
          <div
            className={`p-4 rounded-xl ${
              darkMode ? "bg-white/5" : "bg-gray-50"
            }`}
          >
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {provider._count.inquiries}
            </p>
            <p className={`text-sm ${textMuted}`}>Inquiries</p>
          </div>
          <div
            className={`p-4 rounded-xl ${
              darkMode ? "bg-white/5" : "bg-gray-50"
            }`}
          >
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {provider._count.reviews}
            </p>
            <p className={`text-sm ${textMuted}`}>Reviews</p>
          </div>
          <div
            className={`p-4 rounded-xl ${
              darkMode ? "bg-white/5" : "bg-gray-50"
            }`}
          >
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {provider.averageRating?.toFixed(1) || "N/A"}
            </p>
            <p className={`text-sm ${textMuted}`}>Rating</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className={`font-medium ${textPrimary}`}>
              Contact Information
            </h4>
            <div className="space-y-2">
              <p className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                <Mail size={16} className={textMuted} />
                {provider.email || provider.owner.email}
              </p>
              {provider.phone && (
                <p
                  className={`flex items-center gap-2 text-sm ${textSecondary}`}
                >
                  <Phone size={16} className={textMuted} />
                  {provider.phone}
                </p>
              )}
              {provider.address && (
                <p
                  className={`flex items-center gap-2 text-sm ${textSecondary}`}
                >
                  <MapPin size={16} className={textMuted} />
                  {provider.address}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className={`font-medium ${textPrimary}`}>Business Details</h4>
            <div className="space-y-2">
              <p className={`text-sm ${textSecondary}`}>
                <span className={textMuted}>Category:</span>{" "}
                {provider.category?.name || "N/A"}
              </p>
              <p className={`text-sm ${textSecondary}`}>
                <span className={textMuted}>Joined:</span>{" "}
                {formatDate(provider.createdAt)}
              </p>
              {provider.priceFrom && (
                <p className={`text-sm ${textSecondary}`}>
                  <span className={textMuted}>Starting Price:</span> ₦
                  {provider.priceFrom}
                </p>
              )}
              {provider.serviceRadius && (
                <p className={`text-sm ${textSecondary}`}>
                  <span className={textMuted}>Service Radius:</span>{" "}
                  {provider.serviceRadius} miles
                </p>
              )}
            </div>
          </div>
        </div>

        {provider.description && (
          <div>
            <h4 className={`font-medium ${textPrimary} mb-2`}>Description</h4>
            <p className={`text-sm ${textSecondary}`}>{provider.description}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
          {!provider.isVerified && (
            <button
              onClick={() => {
                onClose();
                onAction(provider, "APPROVE");
              }}
              className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
            >
              Approve & Verify
            </button>
          )}
          {provider.status !== "SUSPENDED" && (
            <button
              onClick={() => {
                onClose();
                onAction(provider, "SUSPEND");
              }}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
            >
              Suspend
            </button>
          )}
          {provider.status === "SUSPENDED" && (
            <button
              onClick={() => {
                onClose();
                onAction(provider, "ACTIVATE");
              }}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Reactivate
            </button>
          )}
          {!provider.isFeatured ? (
            <button
              onClick={() => {
                onClose();
                onAction(provider, "FEATURE");
              }}
              className="px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
            >
              Feature
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onAction(provider, "UNFEATURE");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              Remove Feature
            </button>
          )}
          <button
            onClick={() => {
              onClose();
              onEdit(provider);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            Edit Details
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Edit Modal
interface EditVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editForm: {
    businessName: string;
    description: string;
    address: string;
    postcode: string;
    phone: string;
    email: string;
    website: string;
    priceFrom: string;
    serviceRadius: string;
    categoryId: string;
    isVerified: boolean;
    isFeatured: boolean;
    isPublished: boolean;
  };
  setEditForm: (form: any) => void;
  categories: Category[];
  onSave: () => void;
  isSubmitting: boolean;
}

export function EditVendorModal({
  isOpen,
  onClose,
  editForm,
  setEditForm,
  categories,
  onSave,
  isSubmitting,
}: EditVendorModalProps) {
  const { darkMode, textPrimary, inputBg, inputBorder } = useAdminTheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Vendor" size="xl">
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Business Name
            </label>
            <input
              type="text"
              value={editForm.businessName}
              onChange={(e) =>
                setEditForm({ ...editForm, businessName: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Phone
            </label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Website
            </label>
            <input
              type="url"
              value={editForm.website}
              onChange={(e) =>
                setEditForm({ ...editForm, website: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
            Address
          </label>
          <input
            type="text"
            value={editForm.address}
            onChange={(e) =>
              setEditForm({ ...editForm, address: e.target.value })
            }
            className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Postcode
            </label>
            <input
              type="text"
              value={editForm.postcode}
              onChange={(e) =>
                setEditForm({ ...editForm, postcode: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Starting Price (₦)
            </label>
            <input
              type="number"
              value={editForm.priceFrom}
              onChange={(e) =>
                setEditForm({ ...editForm, priceFrom: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Service Radius (miles)
            </label>
            <input
              type="number"
              value={editForm.serviceRadius}
              onChange={(e) =>
                setEditForm({ ...editForm, serviceRadius: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
            Category
          </label>
          <select
            value={editForm.categoryId}
            onChange={(e) =>
              setEditForm({ ...editForm, categoryId: e.target.value })
            }
            className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
            Description
          </label>
          <textarea
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
            rows={4}
            className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none`}
          />
        </div>

        <div className="flex flex-wrap gap-6 py-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={editForm.isVerified}
              onChange={(e) =>
                setEditForm({ ...editForm, isVerified: e.target.checked })
              }
              className="w-4 h-4 rounded accent-accent"
            />
            <span className={`text-sm ${textPrimary}`}>Verified</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={editForm.isFeatured}
              onChange={(e) =>
                setEditForm({ ...editForm, isFeatured: e.target.checked })
              }
              className="w-4 h-4 rounded accent-accent"
            />
            <span className={`text-sm ${textPrimary}`}>Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={editForm.isPublished}
              onChange={(e) =>
                setEditForm({ ...editForm, isPublished: e.target.checked })
              }
              className="w-4 h-4 rounded accent-accent"
            />
            <span className={`text-sm ${textPrimary}`}>Published</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Add Vendor Modal
interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (data: AddVendorForm) => void;
  isSubmitting: boolean;
}

export interface AddVendorForm {
  businessName: string;
  ownerEmail: string;
  ownerName: string;
  phone: string;
  categoryId: string;
  description: string;
  address: string;
  postcode: string;
  priceFrom: string;
}

export function AddVendorModal({
  isOpen,
  onClose,
  categories,
  onSubmit,
  isSubmitting,
}: AddVendorModalProps) {
  const { darkMode, textPrimary, textSecondary, inputBg, inputBorder } =
    useAdminTheme();

  const [form, setForm] = useState<AddVendorForm>({
    businessName: "",
    ownerEmail: "",
    ownerName: "",
    phone: "",
    categoryId: "",
    description: "",
    address: "",
    postcode: "",
    priceFrom: "",
  });

  const handleSubmit = () => {
    if (!form.businessName || !form.ownerEmail || !form.categoryId) {
      return;
    }
    onSubmit(form);
  };

  const resetForm = () => {
    setForm({
      businessName: "",
      ownerEmail: "",
      ownerName: "",
      phone: "",
      categoryId: "",
      description: "",
      address: "",
      postcode: "",
      priceFrom: "",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Add New Vendor"
      size="xl"
    >
      <div className="space-y-4">
        <p className={`text-sm ${textSecondary} -mt-2 mb-4`}>
          Create a new vendor account. An invitation email will be sent to the
          owner.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) =>
                setForm({ ...form, businessName: e.target.value })
              }
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              placeholder="e.g., Elite Photography"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Owner Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.ownerEmail}
              onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              placeholder="owner@example.com"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Owner Name
            </label>
            <input
              type="text"
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              placeholder="+44 7XXX XXX XXX"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Starting Price (₦)
            </label>
            <input
              type="number"
              value={form.priceFrom}
              onChange={(e) => setForm({ ...form, priceFrom: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              placeholder="500"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              placeholder="123 High Street"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
              Postcode
            </label>
            <input
              type="text"
              value={form.postcode}
              onChange={(e) => setForm({ ...form, postcode: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              placeholder="SW1A 1AA"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textPrimary} mb-1`}>
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none`}
            placeholder="Brief description of the vendor's services..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !form.businessName ||
              !form.ownerEmail ||
              !form.categoryId
            }
            className="px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Vendor"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
