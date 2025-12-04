"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  Upload,
  Download,
  ChevronDown,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { useState } from "react";

const recentActivity = [
  {
    id: "imp-20240521-a4b3",
    type: "Import (Vendors)",
    status: "Completed",
    statusColor: "text-green-500",
    date: "2024-05-21 14:32 UTC",
    initiatedBy: "admin@eva.com",
    note: "Export generated successfully.",
    hasDownload: false,
  },
  {
    id: "exp-20240520-c8d7",
    type: "Export (Users)",
    status: "Completed",
    statusColor: "text-green-500",
    date: "2024-05-20 09:15 UTC",
    initiatedBy: "admin@eva.com",
    hasDownload: true,
  },
  {
    id: "imp-20240519-e1f2",
    type: "Import (Bookings)",
    status: "Failed",
    statusColor: "text-red-500",
    date: "2024-05-19 18:01 UTC",
    initiatedBy: "admin@eva.com",
    hasDownload: false,
  },
];

const dataTypes = ["Vendors", "Users", "Bookings", "Categories", "Reviews"];
const dateRanges = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"];

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
  const [importDataType, setImportDataType] = useState("Vendors");
  const [exportDataType, setExportDataType] = useState("Vendors");
  const [exportDateRange, setExportDateRange] = useState("Last 7 Days");
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [showExportTypeDropdown, setShowExportTypeDropdown] = useState(false);
  const [showExportDateDropdown, setShowExportDateDropdown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <AdminLayout
      title="Data Management"
      actionButton={{
        label: "Toggle Dark Mode",
        onClick: () => {},
        variant: "secondary",
      }}
      showSearch={false}
    >
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
                {importDataType}
                <ChevronDown size={16} />
              </button>
              {showImportDropdown && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {dataTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setImportDataType(type);
                        setShowImportDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        importDataType === type ? "text-accent" : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {type}
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
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
          >
            <div
              className={`w-12 h-12 rounded-lg ${
                darkMode ? "bg-white/5" : "bg-gray-100"
              } flex items-center justify-center mx-auto mb-3`}
            >
              <Upload size={24} className={textMuted} />
            </div>
            <p className={`text-sm ${textPrimary} mb-1`}>
              <button className="text-accent hover:underline">
                Click to upload
              </button>{" "}
              or drag and drop
            </p>
            <p className={`text-xs ${textMuted}`}>CSV (MAX. 800×400px)</p>
          </div>

          <button className="w-full mt-4 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
            Start Import
          </button>
        </div>

        {/* Export Data */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
          <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
            Export Data
          </h3>
          <p className={`text-sm ${textMuted} mb-5`}>
            Generate and download a CSV file of existing data.
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
                {exportDataType}
                <ChevronDown size={16} />
              </button>
              {showExportTypeDropdown && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {dataTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setExportDataType(type);
                        setShowExportTypeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        exportDataType === type ? "text-accent" : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="mb-4">
            <label
              className={`text-sm font-medium ${textPrimary} mb-1.5 block`}
            >
              Select Date Range
            </label>
            <div className="relative">
              <button
                onClick={() =>
                  setShowExportDateDropdown(!showExportDateDropdown)
                }
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm`}
              >
                {exportDateRange}
                <ChevronDown size={16} />
              </button>
              {showExportDateDropdown && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {dateRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setExportDateRange(range);
                        setShowExportDateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        exportDateRange === range
                          ? "text-accent"
                          : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">
            Generate Export
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className={`text-xl font-bold ${textPrimary} mb-4`}>
          Recent Activity
        </h3>
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
                    Date
                  </th>
                  <th
                    className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                  >
                    Initiated By
                  </th>
                  <th
                    className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                  ></th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-white/5" : "divide-gray-100"
                }`}
              >
                {recentActivity.map((activity) => (
                  <tr
                    key={activity.id}
                    className={`${
                      darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <td className={`px-6 py-4 text-sm ${textMuted}`}>
                      {activity.id}
                    </td>
                    <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                      {activity.type}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-sm font-medium ${activity.statusColor}`}
                      >
                        {activity.status === "Completed" ? (
                          <CheckCircle size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                        {activity.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${textMuted}`}>
                      {activity.date}
                      {activity.note && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle size={12} className="text-green-500" />
                          <span className={`text-xs ${textMuted}`}>
                            {activity.note}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                      {activity.initiatedBy}
                    </td>
                    <td className="px-6 py-4">
                      {activity.hasDownload && (
                        <button className="text-accent text-sm font-medium hover:underline">
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
