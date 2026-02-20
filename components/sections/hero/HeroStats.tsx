const stats = [
  { label: "VETTED VENDORS", value: "120+" },
  { label: "CULTURES SUPPORTED", value: "50+" },
  { label: "AVG. REVIEW", value: "4.9/5" },
];

export default function HeroStats() {
  return (
    <div className="card-float p-4! sm:p-6! w-full sm:max-w-lg mt-10">
      <div className="grid grid-cols-3 divide-x divide-border">
        {stats.map((stat, idx) => (
          <div key={stat.label} className="flex flex-col items-center text-center px-1 sm:px-2">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-1 text-center leading-tight">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
