"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Upload, Trash2 } from "lucide-react";
import Image from "next/image";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => Promise<void>;
  existingPhotos?: PhotoItem[];
  onDeletePhoto?: (photoUrl: string) => Promise<void>;
  darkMode: boolean;
}

export interface PhotoItem {
  url: string;
  alt?: string;
}

export default function PhotoModal({
  isOpen,
  onClose,
  onSubmit,
  existingPhotos = [],
  onDeletePhoto,
  darkMode,
}: PhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedFile) {
      setError("Please select an image");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(selectedFile);
      setSuccessMessage("Photo uploaded successfully");
      setSelectedFile(null);
      setPreview(null);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    if (
      !onDeletePhoto ||
      !confirm("Are you sure you want to delete this photo?")
    )
      return;

    setIsDeletingPhoto(photoUrl);
    try {
      await onDeletePhoto(photoUrl);
      setSuccessMessage("Photo deleted successfully");
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete photo");
    } finally {
      setIsDeletingPhoto(null);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isDeletingPhoto) {
      setSelectedFile(null);
      setPreview(null);
      setError(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
          >
            <div
              className={`${
                darkMode
                  ? "bg-[#1a1a1a] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-2xl border w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
            >
              {/* Header */}
              <div
                className={`sticky top-0 flex items-center justify-between p-6 border-b ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <h2
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Manage Photos
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting || isDeletingPhoto !== null}
                  className={`p-1 rounded-lg transition-colors ${
                    darkMode
                      ? "hover:bg-white/10 text-gray-400"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Messages */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
                    {successMessage}
                  </div>
                )}

                {/* Upload Section */}
                <div>
                  <h3
                    className={`text-sm font-semibold mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Upload New Photo
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* File Input */}
                    <label
                      className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        darkMode
                          ? "border-white/10 hover:border-accent/50 hover:bg-accent/5"
                          : "border-gray-300 hover:border-accent/50 hover:bg-accent/5"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                      <Upload
                        className={`mx-auto mb-2 ${
                          darkMode ? "text-gray-400" : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedFile
                          ? selectedFile.name
                          : "Click to upload or drag and drop"}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          darkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        PNG, JPG, WebP up to 5MB
                      </p>
                    </label>

                    {/* Preview */}
                    {preview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Upload Button */}
                    <button
                      type="submit"
                      disabled={!selectedFile || isSubmitting}
                      className="w-full px-4 py-2.5 rounded-lg font-medium bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      Upload Photo
                    </button>
                  </form>
                </div>

                {/* Existing Photos */}
                {existingPhotos.length > 0 && (
                  <div>
                    <h3
                      className={`text-sm font-semibold mb-3 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Gallery ({existingPhotos.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {existingPhotos.map((photo) => (
                        <motion.div
                          key={photo.url}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="relative group"
                        >
                          <div className="relative w-full h-32 rounded-lg overflow-hidden">
                            <Image
                              src={photo.url}
                              alt={photo.alt || "Photo"}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Delete Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeletePhoto(photo.url)}
                            disabled={
                              isDeletingPhoto === photo.url || isSubmitting
                            }
                            className="absolute top-2 right-2 p-2 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeletingPhoto === photo.url ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  disabled={isSubmitting || isDeletingPhoto !== null}
                  className={`w-full px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/10 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
