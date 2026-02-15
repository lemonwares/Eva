"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  Upload,
  Download,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface ImportJob {
  id: string;
  type: "PROVIDERS" | "CATEGORIES" | "CITIES" | "CULTURE_TAGS";
  fileName: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  createdAt: string;
  completedAt?: string;
  _count: {
    errors: number;
  };
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const dataTypes = [
  { label: "Vendors", value: "providers" },
  { label: "Categories", value: "categories" },
  { label: "Cities", value: "cities" },
  { label: "Culture Tags", value: "culture_tags" },
];

const exportTypes = [
  { label: "Users", value: "users" },
  { label: "Vendors", value: "providers" },
  { label: "Bookings", value: "bookings" },
  { label: "Reviews", value: "reviews" },
  { label: "Inquiries", value: "inquiries" },
];

const formatOptions = [
  { label: "JSON", value: "json" },
  { label: "CSV", value: "csv" },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "COMPLETED":
      return "text-green-500";
    case "FAILED":
      return "text-red-500";
    case "PROCESSING":
      return "text-blue-500";
    default:
      return "text-yellow-500";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle size={14} />;
    case "FAILED":
      return <XCircle size={14} />;
    case "PROCESSING":
      return <Loader2 size={14} className="animate-spin" />;
    default:
      return <Clock size={14} />;
  }
}

export default function AdminDataPage() {
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

  // Import state
  const [importDataType, setImportDataType] = useState("providers");
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{
    isDryRun: boolean;
    results: any[];
  } | null>(null);

  // Export state
  const [exportDataType, setExportDataType] = useState("users");
  const [exportFormat, setExportFormat] = useState("json");
  const [showExportTypeDropdown, setShowExportTypeDropdown] = useState(false);
  const [showExportFormatDropdown, setShowExportFormatDropdown] =
    useState(false);
  const [exporting, setExporting] = useState(false);

  // History state
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/import?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      logger.error("Error fetching import jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        addToast("Please select a CSV file", "error");
        return;
      }
      setSelectedFile(file);
      setImportProgress(null);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        addToast("Please select a CSV file", "error");
        return;
      }
      setSelectedFile(file);
      setImportProgress(null);
    }
  };

  const parseCSV = async (
    file: File
  ): Promise<Record<string, string | number>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.trim().split("\n");
        if (lines.length < 2) {
          reject(new Error("CSV must have headers and at least one data row"));
          return;
        }

        const headers = lines[0]
          .split(",")
          .map((h) => h.trim().replace(/"/g, ""));
        const data: Record<string, string | number>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i]
            .split(",")
            .map((v) => v.trim().replace(/"/g, ""));
          const row: Record<string, string | number> = {};
          headers.forEach((header, index) => {
            const value = values[index] || "";
            // Try to parse as number
            const numValue = parseFloat(value);
            row[header] = isNaN(numValue) ? value : numValue;
          });
          data.push(row);
        }

        resolve(data);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const handleImport = async (isDryRun: boolean = false) => {
    if (!selectedFile) {
      addToast("Please select a file first", "error");
      return;
    }

    setImporting(true);
    try {
      const data = await parseCSV(selectedFile);

      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: importDataType,
          data,
          isDryRun,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Import failed");
      }

      setImportProgress({
        isDryRun,
        results: result.results || [],
      });

      if (isDryRun) {
        addToast(
          `Dry run complete: ${
            result.summary?.successful || 0
          } would succeed, ${result.summary?.failed || 0} would fail`,
          "info"
        );
      } else {
        addToast(
          `Import complete: ${result.summary?.successful || 0} succeeded, ${
            result.summary?.failed || 0
          } failed`,
          "success"
        );
        fetchJobs();
      }
    } catch (err: any) {
      addToast(err.message || "Import failed", "error");
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: exportDataType,
          format: exportFormat,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Export failed");
      }

      // Get the blob and download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportDataType}-export-${Date.now()}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      addToast("Export downloaded successfully", "success");
    } catch (err: any) {
      addToast(err.message || "Export failed", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminLayout title="Data Management" showSearch={false}>
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm flex items-center gap-2 animate-slide-in ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {toast.type === "success" && <CheckCircle size={16} />}
            {toast.type === "error" && <XCircle size={16} />}
            {toast.type === "info" && <AlertCircle size={16} />}
            {toast.message}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Import Data */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
          <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
            Import Data
          </h3>
          <p className={`text-sm ${textMuted} mb-5`}>
            Upload a CSV file to import data into the system.
          </p>

          {/* Data Type Selector */}
          <div className="mb-4">
            <label
              className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
            >
              Select Data Type
            </label>
            <div className="relative">
              <button
                onClick={() => setShowImportDropdown(!showImportDropdown)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm`}
              >
                {dataTypes.find((d) => d.value === importDataType)?.label}
                <ChevronDown size={16} />
              </button>
              {showImportDropdown && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {dataTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setImportDataType(type.value);
                        setShowImportDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        importDataType === type.value
                          ? "text-accent"
                          : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? "border-accent bg-accent/5"
                : darkMode
                ? "border-white/20 hover:border-white/30"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
          >
            <div
              className={`w-12 h-12 rounded-lg ${
                darkMode ? "bg-white/5" : "bg-gray-100"
              } flex items-center justify-center mx-auto mb-3`}
            >
              <Upload size={24} className={textMuted} />
            </div>
            {selectedFile ? (
              <div>
                <p className={`text-sm ${textPrimary} mb-1`}>
                  <FileText size={14} className="inline mr-1" />
                  {selectedFile.name}
                </p>
                <p className={`text-xs ${textMuted}`}>
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 text-xs mt-2 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <p className={`text-sm ${textPrimary} mb-1`}>
                  <label className="text-accent hover:underline cursor-pointer">
                    Click to upload
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>{" "}
                  or drag and drop
                </p>
                <p className={`text-xs ${textMuted}`}>CSV files only</p>
              </>
            )}
          </div>

          {/* Import Progress */}
          {importProgress && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                darkMode ? "bg-white/5" : "bg-gray-50"
              }`}
            >
              <p className={`text-sm font-medium ${textPrimary} mb-2`}>
                {importProgress.isDryRun ? "Dry Run" : "Import"} Results:
              </p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {importProgress.results.slice(0, 10).map((r, i) => (
                  <div
                    key={i}
                    className={`text-xs flex items-center gap-1 ${
                      r.success ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {r.success ? (
                      <CheckCircle size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    Row {r.row}: {r.businessName || r.name || "Unknown"}
                    {r.error && ` - ${r.error}`}
                  </div>
                ))}
                {importProgress.results.length > 10 && (
                  <p className={`text-xs ${textMuted}`}>
                    ...and {importProgress.results.length - 10} more
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleImport(true)}
              disabled={!selectedFile || importing}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                !selectedFile || importing
                  ? "bg-gray-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {importing ? (
                <Loader2 size={16} className="inline animate-spin mr-1" />
              ) : null}
              Dry Run
            </button>
            <button
              onClick={() => handleImport(false)}
              disabled={!selectedFile || importing}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                !selectedFile || importing
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {importing ? (
                <Loader2 size={16} className="inline animate-spin mr-1" />
              ) : null}
              Start Import
            </button>
          </div>
        </div>

        {/* Export Data */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
          <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
            Export Data
          </h3>
          <p className={`text-sm ${textMuted} mb-5`}>
            Generate and download data from the system.
          </p>

          {/* Data Type Selector */}
          <div className="mb-4">
            <label
              className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
            >
              Select Data Type
            </label>
            <div className="relative">
              <button
                onClick={() =>
                  setShowExportTypeDropdown(!showExportTypeDropdown)
                }
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm`}
              >
                {exportTypes.find((d) => d.value === exportDataType)?.label}
                <ChevronDown size={16} />
              </button>
              {showExportTypeDropdown && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {exportTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setExportDataType(type.value);
                        setShowExportTypeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        exportDataType === type.value
                          ? "text-accent"
                          : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Format Selector */}
          <div className="mb-4">
            <label
              className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
            >
              Select Format
            </label>
            <div className="relative">
              <button
                onClick={() =>
                  setShowExportFormatDropdown(!showExportFormatDropdown)
                }
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm`}
              >
                {formatOptions.find((d) => d.value === exportFormat)?.label}
                <ChevronDown size={16} />
              </button>
              {showExportFormatDropdown && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {formatOptions.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => {
                        setExportFormat(format.value);
                        setShowExportFormatDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        exportFormat === format.value
                          ? "text-accent"
                          : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting}
            className={`w-full mt-4 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              exporting
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {exporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {exporting ? "Generating..." : "Generate Export"}
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${textPrimary}`}>Import History</h3>
          <button
            onClick={fetchJobs}
            className={`p-2 rounded-lg ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <RefreshCw size={18} className={textMuted} />
          </button>
        </div>
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
                    Job ID
                  </th>
                  <th
                    className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                  >
                    Type
                  </th>
                  <th
                    className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                  >
                    Status
                  </th>
                  <th
                    className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                  >
                    Progress
                  </th>
                  <th
                    className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-white/5" : "divide-gray-100"
                }`}
              >
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <Loader2
                        className={`w-6 h-6 animate-spin mx-auto ${textMuted}`}
                      />
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className={`px-6 py-8 text-center ${textMuted}`}
                    >
                      No import jobs found
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr
                      key={job.id}
                      className={`${
                        darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className={`px-6 py-4 text-sm ${textMuted}`}>
                        <code className="text-xs">{job.id.slice(0, 8)}...</code>
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {job.type.replace("_", " ")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm font-medium ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {getStatusIcon(job.status)}
                          {job.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">
                            {job.successCount}
                          </span>
                          <span className={textMuted}>/</span>
                          <span className="text-red-500">{job.errorCount}</span>
                          <span className={textMuted}>of {job.totalRows}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${textMuted}`}>
                        {formatDate(job.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className={`px-6 py-4 border-t ${
                darkMode ? "border-white/5" : "border-gray-100"
              } flex items-center justify-between`}
            >
              <p className={`text-sm ${textMuted}`}>
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    page === 1
                      ? "opacity-50 cursor-not-allowed"
                      : darkMode
                      ? "hover:bg-white/10"
                      : "hover:bg-gray-100"
                  } ${textSecondary}`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    page === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : darkMode
                      ? "hover:bg-white/10"
                      : "hover:bg-gray-100"
                  } ${textSecondary}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
