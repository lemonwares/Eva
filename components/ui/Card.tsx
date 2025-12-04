"use client";

import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  padding = "md",
  shadow = "sm",
  hover = false,
  onClick,
}: CardProps) {
  const baseStyles =
    "bg-white rounded-2xl border border-[oklch(0.92_0.01_280)]";

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const shadowStyles = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  const hoverStyles = hover
    ? "transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    : "";

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${shadowStyles[shadow]} ${hoverStyles} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  children,
  className = "",
  action,
}: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function CardTitle({
  children,
  className = "",
  as: Component = "h3",
}: CardTitleProps) {
  return (
    <Component
      className={`text-lg font-semibold text-[oklch(0.25_0.02_280)] ${className}`}
    >
      {children}
    </Component>
  );
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({
  children,
  className = "",
}: CardDescriptionProps) {
  return (
    <p className={`text-sm text-[oklch(0.55_0.02_280)] ${className}`}>
      {children}
    </p>
  );
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div
      className={`flex items-center justify-between mt-4 pt-4 border-t border-[oklch(0.92_0.01_280)] ${className}`}
    >
      {children}
    </div>
  );
}
