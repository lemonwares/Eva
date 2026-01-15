"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/admin/Modal";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  displayOrder?: number;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  seoIntro?: string;
  faqs?: Array<{ question: string; answer: string }>;
  aliases?: string[];
  subTags?: string[];
}

interface CategoryFormModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
  mode: "add" | "edit";
}

export default function CategoryFormModal({
  category,
  isOpen,
  onClose,
  onSave,
  mode,
}: CategoryFormModalProps) {
  const {
    darkMode,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useAdminTheme();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    coverImage: "",
    displayOrder: 0,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
    aliasesText: "",
    subTagsText: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category && mode === "edit") {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        icon: category.icon || "",
        coverImage: category.coverImage || "",
        displayOrder: category.displayOrder || 0,
        isFeatured: category.isFeatured || false,
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
        aliasesText: category.aliases?.join(", ") || "",
        subTagsText: category.subTags?.join(", ") || "",
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "",
        coverImage: "",
        displayOrder: 0,
        isFeatured: false,
        metaTitle: "",
        metaDescription: "",
        aliasesText: "",
        subTagsText: "",
      });
    }
  }, [category, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const aliases = formData.aliasesText
      .split(",")
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean);

    const subTags = formData.subTagsText
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const data: Partial<Category> = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      icon: formData.icon,
      coverImage: formData.coverImage,
      displayOrder: formData.displayOrder,
      isFeatured: formData.isFeatured,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      aliases,
      subTags,
    };

    await onSave(data);
    setSaving(false);
  };

  const labelClass = `block text-sm font-medium ${textSecondary} mb-2`;
  const inputClass = `w-full px-3 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add Category" : "Edit Category"}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="basic" className="flex-1">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex-1">
              SEO
            </TabsTrigger>
            <TabsTrigger value="taxonomy" className="flex-1">
              Taxonomy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputClass}
                  required
                  placeholder="e.g., Makeup Artists"
                />
              </div>

              <div>
                <label className={labelClass}>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className={inputClass}
                  required
                  placeholder="e.g., makeup-artists"
                  pattern="[a-z0-9-]+"
                />
                <p className={`text-xs ${textMuted} mt-1`}>
                  Lowercase letters, numbers, and hyphens only
                </p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`${inputClass} min-h-[100px] resize-y`}
                placeholder="Brief description of this category"
              />
            </div>

            <div>
              <label className={labelClass}>Cover Image URL</label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                className={inputClass}
                placeholder="e.g., https://images.unsplash.com/photo-..."
              />
              <p className={`text-xs ${textMuted} mt-1`}>
                URL of the cover image for this category
              </p>
              {formData.coverImage && (
                <div className="mt-3 rounded-lg overflow-hidden h-48 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={formData.coverImage}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Icon</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className={inputClass}
                  placeholder="e.g., Camera, Music, Users"
                />
                <p className={`text-xs ${textMuted} mt-1`}>
                  Use{" "}
                  <a
                    href="https://lucide.dev/icons"
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    Lucide icon names
                  </a>
                </p>
              </div>

              <div>
                <label className={labelClass}>Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className={inputClass}
                  min={0}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-5 h-5 text-accent rounded focus:ring-accent"
                />
                <div>
                  <span className={`block text-sm font-medium ${textPrimary}`}>
                    Feature this category
                  </span>
                  <span className={`block text-xs ${textMuted}`}>
                    Featured categories appear on the homepage and top level
                    places.
                  </span>
                </div>
              </label>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div>
              <label className={labelClass}>Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                className={inputClass}
                maxLength={60}
                placeholder="SEO title (60 chars max)"
              />
              <p className={`text-xs ${textMuted} mt-1`}>
                {formData.metaTitle.length}/60 characters
              </p>
            </div>

            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metaDescription: e.target.value,
                  })
                }
                className={`${inputClass} min-h-[100px] resize-y`}
                maxLength={160}
                placeholder="SEO description (160 chars max)"
              />
              <p className={`text-xs ${textMuted} mt-1`}>
                {formData.metaDescription.length}/160 characters
              </p>
            </div>
          </TabsContent>

          <TabsContent value="taxonomy" className="space-y-4">
            <div>
              <label className={labelClass}>Aliases</label>
              <input
                type="text"
                value={formData.aliasesText}
                onChange={(e) =>
                  setFormData({ ...formData, aliasesText: e.target.value })
                }
                className={inputClass}
                placeholder="e.g., makeup, beauticians"
              />
              <p className={`text-xs ${textMuted} mt-1`}>
                Comma-separated list of alternative names for search expansion
              </p>
            </div>

            <div>
              <label className={labelClass}>Sub-tags</label>
              <input
                type="text"
                value={formData.subTagsText}
                onChange={(e) =>
                  setFormData({ ...formData, subTagsText: e.target.value })
                }
                className={inputClass}
                placeholder="e.g., bridal-makeup, airbrush"
              />
              <p className={`text-xs ${textMuted} mt-1`}>
                Comma-separated list of filterable keywords within this category
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-lg border ${inputBorder} ${textSecondary} hover:bg-gray-50 dark:hover:bg-white/5 transition-colors`}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            disabled={saving}
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {mode === "add" ? "Create Category" : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
