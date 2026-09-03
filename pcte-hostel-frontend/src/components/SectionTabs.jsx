/**
 * Executive segment-control tab bar with a refined institution label badge.
 * tabs: [{ key, label, icon: LucideIcon }]
 */
export default function SectionTabs({ flagLabel, tabs, activeKey, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Institution Label */}
      {flagLabel && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand bg-brand/8 border border-brand/20 px-2.5 py-1 rounded-full">
            {flagLabel}
          </span>
        </div>
      )}

      {/* Segment Control */}
      <div className="flex items-center flex-wrap gap-1 bg-paper border border-line p-1 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? "bg-navy text-white shadow-sm"
                  : "text-muted hover:text-ink hover:bg-card"
              }`}
            >
              {Icon && (
                  <Icon size={13} className={isActive ? "text-blue-200" : "text-muted"} />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
