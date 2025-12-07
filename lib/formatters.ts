// Date formatting utilities
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}

export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string
): string {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  const sameDay = sameMonth && start.getDate() === end.getDate();

  if (sameDay) {
    return formatDate(start);
  }

  if (sameMonth) {
    return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString(
      "en-NG",
      { month: "long", year: "numeric" }
    )}`;
  }

  if (sameYear) {
    return `${start.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  return `${formatDate(start, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })} - ${formatDate(end, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}`;
}

// Currency formatting
export function formatCurrency(
  amount: number,
  currency: string = "EUR",
  locale: string = "en-IE"
): string {
  // Handle NaN, undefined, or null values
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "€0";
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(
  num: number,
  options?: Intl.NumberFormatOptions
): string {
  // Handle NaN, undefined, or null values
  if (num === null || num === undefined || isNaN(num)) {
    return "0";
  }
  return new Intl.NumberFormat("en-NG", options).format(num);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Text formatting
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function deslugify(slug: string): string {
  return titleCase(slug.replace(/-/g, " "));
}

export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

export function formatList(
  items: string[],
  conjunction: string = "and"
): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  return `${otherItems.join(", ")}, ${conjunction} ${lastItem}`;
}

// Phone number formatting
export function formatPhoneNumber(
  phone: string,
  countryCode: string = "+234"
): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Handle Nigerian numbers
  if (countryCode === "+234") {
    if (digits.startsWith("234")) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
        6,
        9
      )} ${digits.slice(9)}`;
    }
    if (digits.startsWith("0")) {
      return `+234 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(
        7
      )}`;
    }
    return `+234 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
      6
    )}`;
  }

  return phone;
}

// File size formatting
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Duration formatting
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? "s" : ""}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

// Rating display
export function formatRating(rating: number, maxRating: number = 5): string {
  return `${rating.toFixed(1)}/${maxRating}`;
}

// Address formatting
export function formatAddress(address: {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}): string {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
}

// Name formatting
export function formatFullName(
  firstName?: string | null,
  lastName?: string | null
): string {
  return [firstName, lastName].filter(Boolean).join(" ") || "Anonymous";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Status formatting
export function formatStatus(status: string): string {
  return titleCase(status.replace(/_/g, " "));
}

// Ordinal numbers
export function formatOrdinal(num: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
