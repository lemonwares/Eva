"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  Search,
  ChevronDown,
  Edit2,
  MapPin,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  Star,
  Globe,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Toast } from "@/components/admin/Toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

interface City {
  id: string;
  name: string;
  slug: string;
  county: string | null;
  region: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  displayOrder: number;
  isFeatured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CityFormData {
  name: string;
  slug: string;
  county: string;
  region: string;
  country: string;
  latitude: string;
  longitude: string;
  displayOrder: string;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
}

const emptyFormData: CityFormData = {
  name: "",
  slug: "",
  county: "",
  region: "",
  country: "United Kingdom",
  latitude: "",
  longitude: "",
  displayOrder: "0",
  isFeatured: false,
  metaTitle: "",
  metaDescription: "",
};

export default function AdminCitiesPage() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useAdminTheme();

  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState<CityFormData>(emptyFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [confirmDelete, setConfirmDelete] = useState<City | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 10;

  const fetchCities = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (regionFilter) params.append("region", regionFilter);

      const res = await fetch(`/api/cities?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCities(data);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, regionFilter]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // Get unique regions for filter
  const regions = Array.from(
    new Set(cities.map((c) => c.region).filter(Boolean))
  ) as string[];

  // Pagination
  const totalPages = Math.ceil(cities.length / itemsPerPage);
  const paginatedCities = cities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddModal = () => {
    setEditingCity(null);
    setFormData(emptyFormData);
    setShowModal(true);
  };

  const openEditModal = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      slug: city.slug,
      county: city.county || "",
      region: city.region || "",
      country: city.country,
      latitude: city.latitude?.toString() || "",
      longitude: city.longitude?.toString() || "",
      displayOrder: city.displayOrder.toString(),
      isFeatured: city.isFeatured,
      metaTitle: city.metaTitle || "",
      metaDescription: city.metaDescription || "",
    });
    setShowModal(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setToast({ show: true, message: "City name is required", type: "error" });
      return;
    }

    if (!formData.slug.trim()) {
      setToast({ show: true, message: "City slug is required", type: "error" });
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        country: formData.country.trim(),
        isFeatured: formData.isFeatured,
        displayOrder: parseInt(formData.displayOrder) || 0,
      };

      if (formData.county.trim()) payload.county = formData.county.trim();
      if (formData.region.trim()) payload.region = formData.region.trim();
      if (formData.latitude) payload.latitude = parseFloat(formData.latitude);
      if (formData.longitude)
        payload.longitude = parseFloat(formData.longitude);
      if (formData.metaTitle.trim())
        payload.metaTitle = formData.metaTitle.trim();
      if (formData.metaDescription.trim())
        payload.metaDescription = formData.metaDescription.trim();

      let res: Response;
      if (editingCity) {
        res = await fetch(`/api/cities/${editingCity.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setToast({
          show: true,
          message: `City ${editingCity ? "updated" : "created"} successfully`,
          type: "success",
        });
        setShowModal(false);
        fetchCities();
      } else {
        const err = await res.json();
        setToast({
          show: true,
          message: err.message || "Failed to save city",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error saving city:", err);
      setToast({ show: true, message: "Failed to save city", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/cities/${confirmDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setToast({
          show: true,
          message: "City deleted successfully",
          type: "success",
        });
        fetchCities();
      } else {
        const err = await res.json();
        setToast({
          show: true,
          message: err.message || "Failed to delete city",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error deleting city:", err);
      setToast({ show: true, message: "Failed to delete city", type: "error" });
    } finally {
      setIsDeleting(false);
      setConfirmDelete(null);
    }
  };





  const toggleFeatured = async (city: City, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !city.isFeatured;
    
    // Optimistic update
    setCities(cities.map(c => c.id === city.id ? { ...c, isFeatured: newStatus } : c));

    try {
      const res = await fetch(`/api/cities/${city.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }
    } catch (err) {
      // Revert on failure
      setCities(cities.map(c => c.id === city.id ? { ...c, isFeatured: !newStatus } : c));
      setToast({ show: true, message: "Failed to update status", type: "error" });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout
      title="Cities"
      actionButton={{
        label: "Add City",
        onClick: openAddModal,
        icon: <Plus size={18} />,
      }}
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
          />
          <input
            type="text"
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
          />
        </div>

        {regions.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm min-w-40 focus:outline-none focus:ring-2 focus:ring-accent/50`}
            >
              <Globe size={16} />
              {regionFilter || "All Regions"}
              <ChevronDown size={16} className="ml-auto" />
            </button>
            {showRegionDropdown && (
              <div
                className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
              >
                <button
                  onClick={() => {
                    setRegionFilter(null);
                    setShowRegionDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    !regionFilter ? "text-accent" : textSecondary
                  } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                >
                  All Regions
                </button>
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setRegionFilter(region);
                      setShowRegionDropdown(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      regionFilter === region ? "text-accent" : textSecondary
                    } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : cities.length === 0 ? (
        <div
          className={`${cardBg} border ${cardBorder} rounded-xl p-12 text-center`}
        >
          <MapPin className={`w-12 h-12 mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            No cities found
          </h3>
          <p className={textMuted}>
            {searchQuery || regionFilter
              ? "No cities match your search criteria."
              : "No cities have been added yet."}
          </p>
          {!searchQuery && !regionFilter && (
            <button
              onClick={openAddModal}
              className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Add First City
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Cities Table */}
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      City
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Region
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      County
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Country
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Featured
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Order
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Created
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    darkMode ? "divide-white/5" : "divide-gray-100"
                  }`}
                >
                  {paginatedCities.map((city) => (
                    <tr
                      key={city.id}
                      className={`${
                        darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className={`px-6 py-4`}>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              darkMode ? "bg-white/5" : "bg-gray-100"
                            }`}
                          >
                            <MapPin size={20} className="text-accent" />
                          </div>
                          <div>
                            <p className={`font-medium ${textPrimary}`}>
                              {city.name}
                            </p>
                            <p className={`text-xs ${textMuted}`}>
                              {city.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {city.region || "-"}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {city.county || "-"}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {city.country}
                      </td>
                      <td className="px-6 py-4">
                        {city.isFeatured ? (
                          <button 
                            onClick={(e) => toggleFeatured(city, e)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
                          >
                            <Star size={12} className="fill-current" />
                            Featured
                          </button>
                        ) : (
                          <button
                            onClick={(e) => toggleFeatured(city, e)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                              textMuted
                            } hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10`}
                          >
                            <Star size={12} />
                            Standard
                          </button>
                        )}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textMuted}`}>
                        {city.displayOrder}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textMuted}`}>
                        {formatDate(city.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(city)}
                            className={`p-2 rounded-lg ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            } transition-colors`}
                            title="Edit"
                          >
                            <Edit2 size={16} className={textMuted} />
                          </button>
                          <a
                            href={`/locations/${city.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-lg ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            } transition-colors`}
                            title="View Live"
                          >
                            <ExternalLink size={16} className={textMuted} />
                          </a>
                          <button
                            onClick={() => setConfirmDelete(city)}
                            className={`p-2 rounded-lg ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            } transition-colors text-red-500`}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <p className={`text-sm ${textMuted}`}>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, cities.length)} of{" "}
                  {cities.length} results
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronLeft size={18} className={textMuted} />
                  </button>
                  {Array.from(
                    { length: Math.min(5, totalPages) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded flex items-center justify-center text-sm transition-colors ${
                        currentPage === page
                          ? "bg-accent text-white"
                          : `${textSecondary} ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            }`
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronRight size={18} className={textMuted} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCity ? "Edit City" : "Add City"}
        size="lg"
      >
        <div className="mt-2">
          <Tabs defaultValue="general">
            <TabsList className="mb-6 w-full grid grid-cols-3">
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="location">Location Data</TabsTrigger>
              <TabsTrigger value="seo">SEO Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-1.5`}
                  >
                    City Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: editingCity ? formData.slug : generateSlug(name),
                      });
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    placeholder="e.g., London"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-1.5`}
                  >
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    placeholder="e.g., london"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-1.5`}
                  >
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg w-full hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isFeatured: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </div>
                    <span className={`text-sm font-medium ${textPrimary}`}>
                      Featured City
                    </span>
                  </label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-1.5`}
                  >
                    Region
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) =>
                      setFormData({ ...formData, region: e.target.value })
                    }
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    placeholder="e.g., Greater London"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-1.5`}
                  >
                    County/State
                  </label>
                  <input
                    type="text"
                    value={formData.county}
                    onChange={(e) =>
                      setFormData({ ...formData, county: e.target.value })
                    }
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    placeholder="e.g., England"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-3 sm:col-span-1">
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-1.5`}
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    placeholder="United Kingdom"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-1.5`}
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    placeholder="51.5074"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-1.5`}
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longitude: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                    placeholder="-0.1278"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-5">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Pro Tip:</span> Good SEO titles and descriptions help your city pages appear in Google search results.
                </p>
              </div>
              
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-1.5`}
                >
                  Meta Title (SEO)
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
                  placeholder="Event vendors in London - Eva Marketplace"
                  maxLength={60}
                />
                <div className="flex justify-between mt-1">
                  <p className={`text-xs ${textMuted}`}>
                    Recommended: 50-60 chars
                  </p>
                  <p
                    className={`text-xs ${
                      formData.metaTitle.length > 60
                        ? "text-red-500"
                        : textMuted
                    }`}
                  >
                    {formData.metaTitle.length}/60
                  </p>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-1.5`}
                >
                  Meta Description (SEO)
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metaDescription: e.target.value,
                    })
                  }
                  rows={4}
                  className={`w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none`}
                  placeholder="Find the best event vendors in London. Compare prices, read reviews, and book top-rated photographers, caterers, and venues..."
                  maxLength={180}
                />
                <div className="flex justify-between mt-1">
                  <p className={`text-xs ${textMuted}`}>
                    Recommended: 150-160 chars
                  </p>
                  <p
                    className={`text-xs ${
                      formData.metaDescription.length > 160
                        ? "text-red-500"
                        : textMuted
                    }`}
                  >
                    {formData.metaDescription.length}/160
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowModal(false)}
            className={`px-4 py-2.5 rounded-lg border ${inputBorder} ${textSecondary} hover:bg-gray-50 dark:hover:bg-white/5 transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {editingCity ? "Update City" : "Add City"}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete City"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        isLoading={isDeleting}
      />

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </AdminLayout>
  );
}
