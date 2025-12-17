import {
  Calendar,
  FileText,
  Home,
  LogOut,
  Settings,
  User,
  Users,
} from "lucide-react";
import { ReactNode } from "react";
import { signOut } from "next-auth/react";

type VendorSidebarProps = {
  activeItem?: string;
  onLogout?: () => void;
};

const navItems: { label: string; icon: ReactNode }[] = [
  { label: "Dashboard", icon: <Home size={20} /> },
  { label: "Inquiries", icon: <Users size={20} /> },
  { label: "Quotes", icon: <FileText size={20} /> },
  { label: "Bookings", icon: <Calendar size={20} /> },
  { label: "Profile", icon: <User size={20} /> },
  { label: "Settings", icon: <Settings size={20} /> },
];

export default function VendorSidebar({
  activeItem = "Dashboard",
  onLogout,
}: VendorSidebarProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      signOut({ callbackUrl: "/", redirect: true });
    }
  };
  return (
    <aside className="w-72 bg-white border-r border-border flex flex-col justify-between py-8 px-6">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-700 text-2xl font-bold">🌿</span>
          </div>
          <div>
            <div className="font-bold text-lg">Urban Bloom</div>
            <div className="text-muted-foreground text-sm">Florist</div>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map(({ icon, label }) => (
            <SidebarItem
              key={label}
              icon={icon}
              label={label}
              active={label === activeItem}
            />
          ))}
        </nav>
      </div>
      <button
        className="flex items-center gap-2 text-muted-foreground hover:text-red-600 font-medium mt-8"
        onClick={handleLogout}
      >
        <LogOut size={20} /> Log Out
      </button>
    </aside>
  );
}

type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
};

function SidebarItem({ icon, label, active }: SidebarItemProps) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-medium transition-colors ${
        active
          ? "bg-green-100 text-green-700"
          : "text-muted-foreground hover:bg-gray-100 hover:text-green-700"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
