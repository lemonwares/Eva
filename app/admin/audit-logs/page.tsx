"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { logger } from "@/lib/logger";
import {
  FileText,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  Calendar,
  Activity,
  Download,
  Eye,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: any;
  metadata: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface Filters {
  actions: { action: string; count: number }[];
  entityTypes: { type: string; count: number }[];
}

const ACTION_COLORS: Record<string, string> = {
  USER_CREATED: "bg-green-100 text-green-700",
  USER_UPDATED: "bg-blue-100 text-blue-700",
  USER_DELETED: "bg-red-100 text-red-700",
  PROVIDER_CREATED: "bg-green-100 text-green-700",
  PROVIDER_VERIFIED: "bg-emerald-100 text-emerald-700",
  PROVIDER_SUSPENDED: "bg-orange-100 text-orange-700",
  QUOTE_CREATED: "bg-blue-100 text-blue-700",
  QUOTE_SENT: "bg-indigo-100 text-indigo-700",
  QUOTE_ACCEPTED: "bg-green-100 text-green-700",
  BOOKING_CREATED: "bg-purple-100 text-purple-700",
  BOOKING_CANCELLED: "bg-red-100 text-red-700",
  PAYMENT_PROCESSED: "bg-green-100 text-green-700",
  REFUND_ISSUED: "bg-amber-100 text-amber-700",
  REVIEW_APPROVED: "bg-green-100 text-green-700",
  REVIEW_REJECTED: "bg-red-100 text-red-700",
  REVIEW_FLAGGED: "bg-orange-100 text-orange-700",
  IMPORT_STARTED: "bg-blue-100 text-blue-700",
  IMPORT_COMPLETED: "bg-green-100 text-green-700",
  FEATURE_FLAG_TOGGLED: "bg-purple-100 text-purple-700",
  SETTINGS_UPDATED: "bg-gray-100 text-gray-700",
};

export default function AuditLogsPage() {
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

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [availableFilters, setAvailableFilters] = useState<Filters | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Detail modal
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
      });

      if (actionFilter) params.append("action", actionFilter);
      if (entityFilter) params.append("entityType", entityFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`/api/admin/audit-logs?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch audit logs");
      }

      setLogs(data.logs);
      setPagination(data.pagination);
      setAvailableFilters(data.filters);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter, entityFilter, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ");
  };

  const openDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailModalOpen(true);
  };

  const exportLogs = async () => {
    try {
      const params = new URLSearchParams({ limit: "1000" });
      if (actionFilter) params.append("action", actionFilter);
      if (entityFilter) params.append("entityType", entityFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`/api/admin/audit-logs?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error("Failed to export");

      // Convert to CSV
      const headers = [
        "Timestamp",
        "Action",
        "Entity Type",
        "Entity ID",
        "User",
        "IP Address",
      ];
      const rows = data.logs.map((log: AuditLog) => [
        new Date(log.createdAt).toISOString(),
        log.action,
        log.entityType,
        log.entityId,
        log.user?.email || "System",
        log.ipAddress || "",
      ]);

      const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      logger.error("Export failed:", err);
    }
  };

  const clearFilters = () => {
    setActionFilter("");
    setEntityFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasFilters = actionFilter || entityFilter || startDate || endDate;

  return (
    <AdminLayout title="Audit Logs" showSearch={false}>
      <div
        className={`min-h-screen ${
          darkMode ? "bg-[#0a0a0a]" : "bg-gray-50"
        } p-4 md:p-6`}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${textPrimary}`}>Audit Logs</h1>
            <p className={textSecondary}>
              Track all system activities and changes
            </p>
          </div>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-4 mb-6`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Action Filter */}
            <div className="flex-1">
              <label
                className={`block text-sm font-medium ${textSecondary} mb-1`}
              >
                Action
              </label>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setPage(1);
                }}
                className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary}`}
              >
                <option value="">All Actions</option>
                {availableFilters?.actions.map((a) => (
                  <option key={a.action} value={a.action}>
                    {formatAction(a.action)} ({a.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Entity Type Filter */}
            <div className="flex-1">
              <label
                className={`block text-sm font-medium ${textSecondary} mb-1`}
              >
                Entity Type
              </label>
              <select
                value={entityFilter}
                onChange={(e) => {
                  setEntityFilter(e.target.value);
                  setPage(1);
                }}
                className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary}`}
              >
                <option value="">All Entities</option>
                {availableFilters?.entityTypes.map((e) => (
                  <option key={e.type} value={e.type}>
                    {e.type} ({e.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="flex-1">
              <label
                className={`block text-sm font-medium ${textSecondary} mb-1`}
              >
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary}`}
              />
            </div>

            <div className="flex-1">
              <label
                className={`block text-sm font-medium ${textSecondary} mb-1`}
              >
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary}`}
              />
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className={`text-sm ${textSecondary} hover:${textPrimary} flex items-center gap-1`}
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Logs Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl p-8 text-center`}
          >
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchLogs}
              className="mt-4 px-4 py-2 bg-accent text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl p-12 text-center`}
          >
            <Activity className={`w-16 h-16 mx-auto ${textMuted}`} />
            <p className={`mt-4 text-lg font-medium ${textPrimary}`}>
              No audit logs found
            </p>
            <p className={`mt-1 ${textMuted}`}>
              {hasFilters
                ? "Try adjusting your filters"
                : "Activity will appear here as it occurs"}
            </p>
          </div>
        ) : (
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
                  <tr>
                    <th
                      className={`px-4 py-3 text-left text-sm font-medium ${textSecondary}`}
                    >
                      Timestamp
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-medium ${textSecondary}`}
                    >
                      Action
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-medium ${textSecondary}`}
                    >
                      Entity
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-medium ${textSecondary}`}
                    >
                      User
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-medium ${textSecondary}`}
                    >
                      IP Address
                    </th>
                    <th
                      className={`px-4 py-3 text-right text-sm font-medium ${textSecondary}`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className={`${
                        darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className={`px-4 py-3 text-sm ${textSecondary}`}>
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                            ACTION_COLORS[log.action] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {formatAction(log.action)}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm ${textPrimary}`}>
                        <div>
                          <span className="font-medium">{log.entityType}</span>
                          <span
                            className={`block text-xs ${textMuted} font-mono`}
                          >
                            {log.entityId.substring(0, 8)}...
                          </span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${textPrimary}`}>
                        {log.user ? (
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                darkMode ? "bg-gray-700" : "bg-gray-100"
                              }`}
                            >
                              <User className={`w-4 h-4 ${textMuted}`} />
                            </div>
                            <div>
                              <p className={`font-medium ${textPrimary}`}>
                                {log.user.name || "Unknown"}
                              </p>
                              <p className={`text-xs ${textMuted}`}>
                                {log.user.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className={textMuted}>System</span>
                        )}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-mono ${textMuted}`}
                      >
                        {log.ipAddress || "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openDetail(log)}
                          className={`p-2 rounded-lg ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                          }`}
                          title="View Details"
                        >
                          <Eye className={`w-4 h-4 ${textSecondary}`} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div
                className={`flex items-center justify-between px-4 py-3 border-t ${cardBorder}`}
              >
                <p className={textSecondary}>
                  Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className={`p-2 rounded-lg ${cardBg} border ${cardBorder} ${
                      page <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-accent/10"
                    } ${textPrimary}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.pages}
                    className={`p-2 rounded-lg ${cardBg} border ${cardBorder} ${
                      page >= pagination.pages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-accent/10"
                    } ${textPrimary}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        {detailModalOpen && selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDetailModalOpen(false)}
            />
            <div
              className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl ${cardBg} shadow-xl`}
            >
              {/* Header */}
              <div
                className={`sticky top-0 flex items-center justify-between p-4 border-b ${cardBorder} ${cardBg}`}
              >
                <h2 className={`text-lg font-semibold ${textPrimary}`}>
                  Audit Log Details
                </h2>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className={`p-2 rounded-lg ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X className={`w-5 h-5 ${textSecondary}`} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${textMuted}`}>Action</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded mt-1 ${
                        ACTION_COLORS[selectedLog.action] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {formatAction(selectedLog.action)}
                    </span>
                  </div>
                  <div>
                    <p className={`text-sm ${textMuted}`}>Timestamp</p>
                    <p className={`font-medium ${textPrimary}`}>
                      {formatDate(selectedLog.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${textMuted}`}>Entity Type</p>
                    <p className={`font-medium ${textPrimary}`}>
                      {selectedLog.entityType}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${textMuted}`}>Entity ID</p>
                    <p className={`font-mono text-sm ${textPrimary}`}>
                      {selectedLog.entityId}
                    </p>
                  </div>
                </div>

                {/* User Info */}
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <h3 className={`font-medium ${textPrimary} mb-3`}>User</h3>
                  {selectedLog.user ? (
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          darkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        <User className={`w-5 h-5 ${textMuted}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${textPrimary}`}>
                          {selectedLog.user.name || "Unknown"}
                        </p>
                        <p className={`text-sm ${textMuted}`}>
                          {selectedLog.user.email} • {selectedLog.user.role}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className={textMuted}>System Action</p>
                  )}
                </div>

                {/* Network Info */}
                {(selectedLog.ipAddress || selectedLog.userAgent) && (
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <h3 className={`font-medium ${textPrimary} mb-3`}>
                      Network Info
                    </h3>
                    <div className="space-y-2">
                      {selectedLog.ipAddress && (
                        <div>
                          <p className={`text-sm ${textMuted}`}>IP Address</p>
                          <p className={`font-mono ${textPrimary}`}>
                            {selectedLog.ipAddress}
                          </p>
                        </div>
                      )}
                      {selectedLog.userAgent && (
                        <div>
                          <p className={`text-sm ${textMuted}`}>User Agent</p>
                          <p className={`text-sm ${textSecondary} break-all`}>
                            {selectedLog.userAgent}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Changes */}
                {selectedLog.changes && (
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <h3 className={`font-medium ${textPrimary} mb-3`}>
                      Changes
                    </h3>
                    <pre
                      className={`text-sm overflow-x-auto p-3 rounded ${
                        darkMode ? "bg-gray-900" : "bg-white"
                      } ${textSecondary}`}
                    >
                      {JSON.stringify(selectedLog.changes, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Metadata */}
                {selectedLog.metadata && (
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <h3 className={`font-medium ${textPrimary} mb-3`}>
                      Metadata
                    </h3>
                    <pre
                      className={`text-sm overflow-x-auto p-3 rounded ${
                        darkMode ? "bg-gray-900" : "bg-white"
                      } ${textSecondary}`}
                    >
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
