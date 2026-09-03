import { Building2, Droplets, Users, Layers } from "lucide-react";

const STATS = [
  { icon: Building2, value: "30",   label: "Residence Rooms",  accent: "#2563EB" },
  { icon: Droplets,  value: "20",   label: "Washroom Blocks",  accent: "#0284C7" },
  { icon: Users,     value: "03",   label: "Dedicated Wardens",accent: "#16A34A" },
  { icon: Layers,    value: "1+3",  label: "Floors per Block", accent: "#2563EB" },
];

export default function HostelStatsStrip() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-ink">At a Glance</h2>
        <p className="text-sm text-muted mt-1">Key facts about PCTE hostel facilities.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ icon: Icon, value, label, accent }) => (
          <div key={label} className="bg-white border border-line rounded-lg p-5 flex items-center gap-4 hover:border-brand/30 transition-colors">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}
            >
              <Icon size={18} style={{ color: accent }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{value}</p>
              <p className="text-[12px] text-muted mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
