import { Bell, Sun } from "lucide-react";
import { useState } from "react";
import VendorSidebar from "@/components/common/VendorSidebar";

type Metric = {
  label: string;
  value: string | number;
  change: string;
  changeColor: string;
};

const metrics: Metric[] = [
  {
    label: "New Inquiries",
    value: 12,
    change: "+5.2%",
    changeColor: "text-green-600",
  },
  {
    label: "Pending Quotes",
    value: 5,
    change: "+1.0%",
    changeColor: "text-green-600",
  },
  {
    label: "Upcoming Bookings",
    value: 8,
    change: "-2.5%",
    changeColor: "text-red-500",
  },
  {
    label: "Monthly Revenue",
    value: "$12,450",
    change: "+15.8%",
    changeColor: "text-green-600",
  },
];

type InquiryStatus = "New" | "Viewed" | "Quoted" | "Declined";

type Inquiry = {
  name: string;
  date: string;
  status: InquiryStatus;
};

const inquiries: Inquiry[] = [
  { name: "Olivia Rhye", date: "Oct 15, 2024", status: "New" },
  { name: "Phoenix Baker", date: "Nov 02, 2024", status: "Viewed" },
  { name: "Lana Steiner", date: "Nov 21, 2024", status: "New" },
  { name: "Demi Wilkinson", date: "Dec 05, 2024", status: "Quoted" },
  { name: "Candice Wu", date: "Dec 18, 2024", status: "Declined" },
];

const statusStyles: Record<InquiryStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Viewed: "bg-yellow-100 text-yellow-700",
  Quoted: "bg-green-100 text-green-700",
  Declined: "bg-red-100 text-red-700",
};

const tabs = ["Inquiries", "Quotes", "Bookings"] as const;
type Tab = (typeof tabs)[number];

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Inquiries");

  return (
    <div className="min-h-screen bg-[#f7f9f7] text-foreground font-sans flex">
      <VendorSidebar />

      {/* Main Content */}
      <main className="flex-1 p-10">
        {/* Top Bar */}
        <div className="flex justify-end items-center gap-6 mb-8">
          <button className="relative">
            <Bell size={22} className="text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
          </button>
          <button className="bg-gray-100 p-2 rounded-full">
            <Sun size={20} className="text-muted-foreground" />
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-sm border border-border"
            >
              <div className="text-muted-foreground text-base mb-2">
                {m.label}
              </div>
              <div className="text-3xl font-bold mb-1">{m.value}</div>
              <div className={`text-sm font-medium ${m.changeColor}`}>
                {m.change}
              </div>
            </div>
          ))}
        </div>

        {/* Tabbed Table */}
        <div className="bg-white rounded-xl shadow-sm border border-border">
          <div className="flex gap-8 px-8 pt-6 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-lg font-semibold transition-colors ${
                  activeTab === tab
                    ? "text-green-700 border-b-2 border-green-600"
                    : "text-muted-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto px-8 py-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted-foreground text-sm">
                  <th className="pb-3">CLIENT NAME</th>
                  <th className="pb-3">EVENT DATE</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq, idx) => (
                  <tr key={idx} className="border-t border-border">
                    <td className="py-4 font-medium">{inq.name}</td>
                    <td className="py-4">{inq.date}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusStyles[inq.status]
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        className={`px-5 py-2 rounded-lg font-semibold text-white ${
                          inq.status === "Quoted"
                            ? "bg-green-100 text-green-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        View & Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
