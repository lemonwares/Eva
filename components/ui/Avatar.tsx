"use client";

import React from "react";
import Image from "next/image";
import { User } from "lucide-react";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

const textSizes = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getBackgroundColor(name: string): string {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({
  src,
  alt = "Avatar",
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const showImage = !!src;
  const showInitials = !src && !!name;
  const showIcon = !src && !name;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 ${
        sizes[size]
      } ${
        showInitials ? getBackgroundColor(name!) : "bg-[oklch(0.92_0.01_280)]"
      } ${className}`}
    >
      {showImage && (
        <Image
          src={src!}
          alt={alt}
          fill
          className="object-cover"
          sizes={size === "xl" ? "64px" : size === "lg" ? "48px" : "40px"}
        />
      )}
      {showInitials && (
        <span className={`font-semibold text-white ${textSizes[size]}`}>
          {getInitials(name!)}
        </span>
      )}
      {showIcon && (
        <User className={`text-[oklch(0.65_0.02_280)] ${iconSizes[size]}`} />
      )}
    </div>
  );
}

export interface AvatarGroupProps {
  avatars: Array<{
    src?: string | null;
    name?: string;
    alt?: string;
  }>;
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = "md",
  className = "",
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`inline-flex items-center justify-center rounded-full bg-[oklch(0.85_0.01_280)] ring-2 ring-white ${sizes[size]}`}
        >
          <span
            className={`font-medium text-[oklch(0.45_0.02_280)] ${textSizes[size]}`}
          >
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}

// User info with avatar
export interface UserInfoProps {
  src?: string | null;
  name: string;
  subtitle?: string;
  size?: AvatarProps["size"];
  className?: string;
}

export function UserInfo({
  src,
  name,
  subtitle,
  size = "md",
  className = "",
}: UserInfoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar src={src} name={name} size={size} />
      <div className="min-w-0">
        <p className="font-medium text-[oklch(0.25_0.02_280)] truncate">
          {name}
        </p>
        {subtitle && (
          <p className="text-sm text-[oklch(0.55_0.02_280)] truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
