import { ShieldCheck, Users, Star, Search } from "lucide-react";

const stats = [
  { label: "Vetted Vendors", value: "120+", icon: Users },
  { label: "Cultures Supported", value: "50+", icon: Star },
  { label: "Avg. Review", value: "4.9/5", icon: ShieldCheck },
  { label: "Smart Search", value: "", icon: Search },
];

export default function HeroStats() {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-2xl bg-white/80 border border-border px-4 py-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-light">
            <stat.icon size={16} className="text-primary" />
          </div>
          <div>
            {stat.value && (
              <p className="text-lg font-bold text-foreground leading-tight">
                {stat.value}
              </p>
            )}
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
