"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { ToastContainer, useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

import VendorFilters from "@/components/admin/vendors/VendorFilters";
import VendorTable from "@/components/admin/vendors/VendorTable";
import {
  ViewVendorModal,
  EditVendorModal,
  AddVendorModal,
  AddVendorForm,
} from "@/components/admin/vendors/VendorModals";

interface Provider {
  id: string;
  businessName: string;
  description: string | null;
  address: string | null;
  postcode: string | null;
  phonePublic: string | null;
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
  serviceRadiusMiles: number | null;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  categories?: string[];
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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StatusCounts {
  active: number;
  pending: number;
  suspended: number;
}

export default function AdminVendorsPage() {
  const { textSecondary, textMuted } = useAdminTheme();
  const { toasts, addToast, removeToast } = useToast();

  // Data state
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const categoriesRef = useRef<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoadRef = useRef(true);
  const addToastRef = useRef(addToast);
  addToastRef.current = addToast;

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [actionType, setActionType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    businessName: "",
    description: "",
    address: "",
    postcode: "",
    phone: "",
    website: "",
    priceFrom: "",
    serviceRadius: "",
    categories: [] as string[],
    isVerified: false,
    isFeatured: false,
    isPublished: false,
  });

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data || []);
          categoriesRef.current = data || [];
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch providers
  const fetchProviders = useCallback(async () => {
    if (isInitialLoadRef.current) {
      setIsLoading(true);
    }
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "10");

      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "All")
        params.append("status", statusFilter.toLowerCase());
      if (categoryFilter !== "All") {
        const cat = categoriesRef.current.find(
          (c) => c.name === categoryFilter
        );
        if (cat) params.append("categoryId", cat.id);
      }

      const res = await fetch(`/api/admin/providers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
        setPagination(data.pagination || null);
        setStatusCounts(data.statusCounts || null);
        console.log(`Res:`, data);
      }
    } catch (err) {
      console.error("Error fetching providers:", err);
      addToastRef.current("Failed to fetch vendors", "error");
    } finally {
      setIsLoading(false);
      isInitialLoadRef.current = false;
    }
  }, [currentPage, searchQuery, statusFilter, categoryFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProviders();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchProviders]);

  // Handler functions
  const handleView = (provider: Provider) => {
    setSelectedProvider(provider);
    setViewModalOpen(true);
  };

  const handleEdit = (provider: Provider) => {
    console.log("Editing provider:", provider);
    setSelectedProvider(provider);
    setEditForm({
      businessName: provider.businessName || "",
      description: provider.description || "",
      address: provider.address || "",
      postcode: provider.postcode || "",
      phone: provider.phonePublic || "",
      website: provider.website || "",
      priceFrom:
        provider.priceFrom !== null && provider.priceFrom !== undefined
          ? provider.priceFrom.toString()
          : "0",
      serviceRadius:
        provider.serviceRadiusMiles !== null &&
        provider.serviceRadiusMiles !== undefined
          ? provider.serviceRadiusMiles.toString()
          : "0",
      categories: provider.categories || [],
      isVerified: provider.isVerified,
      isFeatured: provider.isFeatured,
      isPublished: provider.isPublished,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedProvider) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/providers/${selectedProvider.id}/moderate`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName: editForm.businessName,
            description: editForm.description,
            address: editForm.address,
            postcode: editForm.postcode,
            phone: editForm.phone,
            website: editForm.website,
            priceFrom:
              editForm.priceFrom !== "" && !isNaN(Number(editForm.priceFrom))
                ? parseFloat(editForm.priceFrom)
                : 0,
            serviceRadius:
              editForm.serviceRadius !== "" &&
              !isNaN(Number(editForm.serviceRadius))
                ? parseInt(editForm.serviceRadius)
                : 0,
            categories: editForm.categories,
            isVerified: editForm.isVerified,
            isFeatured: editForm.isFeatured,
            isPublished: editForm.isPublished,
          }),
        }
      );

      if (res.ok) {
        addToast("Vendor updated successfully", "success");
        setEditModalOpen(false);
        fetchProviders();
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to update vendor", "error");
      }
    } catch (err) {
      addToast("An error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (provider: Provider) => {
    setSelectedProvider(provider);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProvider) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/providers/${selectedProvider.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        addToast("Vendor deleted successfully", "success");
        fetchProviders();
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to delete vendor", "error");
      }
    } catch (err) {
      addToast("An error occurred", "error");
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleAction = (provider: Provider, action: string) => {
    setSelectedProvider(provider);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedProvider) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/providers/${selectedProvider.id}/moderate`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: actionType }),
        }
      );

      if (res.ok) {
        addToast(`Vendor ${actionType.toLowerCase()}d successfully`, "success");
        fetchProviders();
      } else {
        const data = await res.json();
        addToast(
          data.error || `Failed to ${actionType.toLowerCase()} vendor`,
          "error"
        );
      }
    } catch (err) {
      addToast("An error occurred", "error");
    } finally {
      setIsSubmitting(false);
      setActionDialogOpen(false);
    }
  };

  const handleAddVendor = async (formData: AddVendorForm) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
          ownerEmail: formData.ownerEmail,
          ownerName: formData.ownerName,
          phone: formData.phone,
          categoryId: formData.categoryId,
          description: formData.description,
          address: formData.address,
          postcode: formData.postcode,
          priceFrom: formData.priceFrom ? parseFloat(formData.priceFrom) : null,
        }),
      });

      if (res.ok) {
        addToast("Vendor created successfully", "success");
        setAddModalOpen(false);
        fetchProviders();
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to create vendor", "error");
      }
    } catch (err) {
      addToast("An error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Vendor Management"
      actionButton={{
        label: "Add New Vendor",
        icon: <Plus size={18} />,
        onClick: () => setAddModalOpen(true),
      }}
    >
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <p className={`${textSecondary} mb-6`}>
        View, edit, and manage all vendor accounts on the platform.
        {statusCounts && (
          <span className={`ml-2 ${textMuted}`}>
            ({statusCounts.active} active, {statusCounts.pending} pending,{" "}
            {statusCounts.suspended} suspended)
          </span>
        )}
      </p>

      {/* Filters */}
      <VendorFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        showStatusDropdown={showStatusDropdown}
        setShowStatusDropdown={setShowStatusDropdown}
        showCategoryDropdown={showCategoryDropdown}
        setShowCategoryDropdown={setShowCategoryDropdown}
        onFilterChange={() => setCurrentPage(1)}
      />

      {/* Vendors Table */}
      <VendorTable
        providers={providers}
        pagination={pagination}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        categories={categories}
      />

      {/* Modals */}
      <ViewVendorModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        provider={selectedProvider}
        onAction={handleAction}
        onEdit={handleEdit}
        categories={categories}
      />

      <EditVendorModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        categories={categories}
        onSave={handleSaveEdit}
        isSubmitting={isSubmitting}
      />

      <AddVendorModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        categories={categories}
        onSubmit={handleAddVendor}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Vendor"
        message={`Are you sure you want to delete "${selectedProvider?.businessName}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        onConfirm={confirmAction}
        title={`${actionType} Vendor`}
        message={`Are you sure you want to ${actionType.toLowerCase()} "${
          selectedProvider?.businessName
        }"?`}
        confirmText={actionType}
        type={
          actionType === "SUSPEND" || actionType === "REJECT"
            ? "danger"
            : actionType === "APPROVE" || actionType === "ACTIVATE"
            ? "success"
            : "info"
        }
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
}
