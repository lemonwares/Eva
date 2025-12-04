"use client";

import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

// Table context for managing table state
interface TableContextType {
  striped?: boolean;
  hoverable?: boolean;
}

const TableContext = React.createContext<TableContextType>({});

export interface TableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export function Table({
  children,
  className = "",
  striped = false,
  hoverable = true,
}: TableProps) {
  return (
    <TableContext.Provider value={{ striped, hoverable }}>
      <div className={`overflow-x-auto ${className}`}>
        <table className="w-full text-left">{children}</table>
      </div>
    </TableContext.Provider>
  );
}

export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  return (
    <thead
      className={`bg-[oklch(0.97_0.01_280)] border-b border-[oklch(0.92_0.01_280)] ${className}`}
    >
      {children}
    </thead>
  );
}

export interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className = "" }: TableBodyProps) {
  return (
    <tbody className={`divide-y divide-[oklch(0.94_0.01_280)] ${className}`}>
      {children}
    </tbody>
  );
}

export interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function TableRow({
  children,
  className = "",
  onClick,
  selected = false,
}: TableRowProps) {
  const { striped, hoverable } = React.useContext(TableContext);

  return (
    <tr
      onClick={onClick}
      className={`
        ${striped ? "even:bg-[oklch(0.98_0.01_280)]" : ""}
        ${hoverable ? "hover:bg-[oklch(0.97_0.01_280)]" : ""}
        ${selected ? "bg-[oklch(0.95_0.08_15)]" : ""}
        ${onClick ? "cursor-pointer" : ""}
        transition-colors
        ${className}
      `}
    >
      {children}
    </tr>
  );
}

export interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
  align?: "left" | "center" | "right";
}

export function TableHead({
  children,
  className = "",
  sortable = false,
  sortDirection = null,
  onSort,
  align = "left",
}: TableHeadProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const content = (
    <>
      {children}
      {sortable && (
        <span className="ml-1.5 inline-flex">
          {sortDirection === "asc" ? (
            <ArrowUp className="w-4 h-4" />
          ) : sortDirection === "desc" ? (
            <ArrowDown className="w-4 h-4" />
          ) : (
            <ArrowUpDown className="w-4 h-4 opacity-50" />
          )}
        </span>
      )}
    </>
  );

  return (
    <th
      className={`px-4 py-3 text-xs font-semibold text-[oklch(0.45_0.02_280)] uppercase tracking-wider ${alignClasses[align]} ${className}`}
    >
      {sortable ? (
        <button
          onClick={onSort}
          className="inline-flex items-center gap-1 hover:text-[oklch(0.25_0.02_280)] transition-colors"
        >
          {content}
        </button>
      ) : (
        content
      )}
    </th>
  );
}

export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  colSpan?: number;
}

export function TableCell({
  children,
  className = "",
  align = "left",
  colSpan,
}: TableCellProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td
      colSpan={colSpan}
      className={`px-4 py-3 text-sm text-[oklch(0.35_0.02_280)] ${alignClasses[align]} ${className}`}
    >
      {children}
    </td>
  );
}

// Empty table state
export interface TableEmptyProps {
  colSpan: number;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function TableEmpty({
  colSpan,
  icon,
  title = "No data found",
  description,
  action,
}: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          {icon && (
            <div className="mb-4 text-[oklch(0.75_0.01_280)]">{icon}</div>
          )}
          <h3 className="text-lg font-medium text-[oklch(0.35_0.02_280)] mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-[oklch(0.55_0.02_280)] mb-4 max-w-sm">
              {description}
            </p>
          )}
          {action && <div>{action}</div>}
        </div>
      </td>
    </tr>
  );
}

// Loading table state
export interface TableLoadingProps {
  colSpan: number;
  rows?: number;
}

export function TableLoading({ colSpan, rows = 5 }: TableLoadingProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: colSpan }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-[oklch(0.92_0.01_280)] rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Checkbox for table selection
export interface TableCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  className?: string;
}

export function TableCheckbox({
  checked,
  onChange,
  indeterminate = false,
  className = "",
}: TableCheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={`w-4 h-4 rounded border-[oklch(0.75_0.01_280)] text-[oklch(0.65_0.25_15)] focus:ring-[oklch(0.65_0.25_15)] ${className}`}
    />
  );
}
