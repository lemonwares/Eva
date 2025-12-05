"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  type?: "avatar" | "cover" | "gallery" | "listing" | "general";
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  maxSizeMB?: number;
  disabled?: boolean;
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  folder,
  type = "general",
  className = "",
  aspectRatio = "auto",
  maxSizeMB = 10,
  disabled = false,
  placeholder = "Click or drag to upload",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "min-h-[150px]",
  };

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a JPEG, PNG, WebP, or GIF image");
        return;
      }

      // Validate file size
      const maxSize = maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`File too large. Maximum size is ${maxSizeMB}MB`);
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("type", type);
        if (folder) {
          formData.append("folder", folder);
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Upload failed");
        }

        if (data.url) {
          onChange(data.url);
        } else if (data.files && data.files.length > 0) {
          onChange(data.files[0].url);
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        setError(err.message || "Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, folder, type, maxSizeMB]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden rounded-lg border-2 border-dashed cursor-pointer
          transition-all duration-200 flex items-center justify-center
          ${aspectClasses[aspectRatio]}
          ${
            dragActive
              ? "border-accent bg-accent/10"
              : value
              ? "border-transparent"
              : "border-gray-300 dark:border-gray-600 hover:border-accent"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isUploading ? "pointer-events-none" : ""}
        `}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </>
        ) : isUploading ? (
          <div className="flex flex-col items-center gap-2 p-4 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-gray-500 dark:text-gray-400">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="text-sm text-center">{placeholder}</span>
            <span className="text-xs text-gray-400">
              JPEG, PNG, WebP, GIF up to {maxSizeMB}MB
            </span>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Multi-image upload component
interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  folder?: string;
  type?: "gallery" | "listing" | "general";
  className?: string;
  disabled?: boolean;
}

export function MultiImageUpload({
  values = [],
  onChange,
  maxImages = 5,
  folder,
  type = "gallery",
  className = "",
  disabled = false,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const remainingSlots = maxImages - values.length;
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      filesToUpload.forEach((file) => formData.append("files", file));
      formData.append("type", type);
      if (folder) formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      if (data.files) {
        const newUrls = data.files.map((f: { url: string }) => f.url);
        onChange([...values, ...newUrls]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {values.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            <Image
              src={url}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="200px"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {values.length < maxImages && (
          <div
            onClick={() =>
              !disabled && !isUploading && inputRef.current?.click()
            }
            className={`
              aspect-square rounded-lg border-2 border-dashed cursor-pointer
              flex flex-col items-center justify-center gap-1
              border-gray-300 dark:border-gray-600 hover:border-accent transition-colors
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {values.length}/{maxImages}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
