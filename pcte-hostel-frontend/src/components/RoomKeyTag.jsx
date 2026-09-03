import { GraduationCap, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

const STATUS_CONFIG = {
  allotted: { label: "Allotted",     badge: "badge-confirmed", icon: CheckCircle2 },
  pending:  { label: "Pending",      badge: "badge-pending",   icon: null },
  rejected: { label: "Not Allotted", badge: "badge-rejected",  icon: null },
};

export default function RoomKeyTag({ status = "pending", hostelBlock, roomNumber, roomType, studentName }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const StatusIcon = s.icon;

  return (
    <div className="credential-card card-elevated institution-watermark max-w-sm w-full">
      {/* University Crest Header */}
      <div className="bg-navy px-6 py-4 flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-white border border-white/20 flex items-center justify-center shrink-0">
          <GraduationCap size={20} className="text-navy" />
        </div>
        <div>
          <p className="font-display font-bold text-white text-sm leading-tight">PCTE Residence</p>
          <p className="text-[10px] text-white/50 font-mono mt-0.5">Residence Allotment Card · Session 2026–27</p>
        </div>
        <div className="ml-auto">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${s.badge}`}>
            {StatusIcon && <StatusIcon size={11} />}
            {s.label}
          </span>
        </div>
      </div>

      {/* Room Details Body */}
      <div className="px-6 py-5 relative z-10">
        {status === "allotted" ? (
          <>
            <div className="flex items-end gap-3 mb-4">
              <div>
                <p className="text-[10px] font-mono text-muted uppercase tracking-widest mb-1">Room Number</p>
                <p className="font-mono font-bold text-5xl text-navy leading-none tracking-tight">{roomNumber}</p>
              </div>
              <div className="pb-1 border-l border-line pl-3">
                <div className="flex items-center gap-1.5 text-xs text-slate mb-1">
                  <Building2 size={12} className="text-brand" />
                  <span>{hostelBlock}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate">
                  <ShieldCheck size={12} className="text-brand" />
                  <span>{roomType}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-y border-line py-2 mb-4">
              <div className="h-6 flex-1 opacity-50" style={{ background: "repeating-linear-gradient(90deg, #0F172A 0 1px, transparent 1px 3px, #0F172A 3px 5px, transparent 5px 8px)" }} />
              <span className="font-mono text-[9px] text-muted tracking-widest">PCTE-HRA-2026</span>
            </div>

            {/* Data Rows */}
            <div className="space-y-2 text-xs border-t border-line pt-4">
              <div className="flex justify-between">
                <span className="text-muted">Resident</span>
                <span className="font-semibold text-ink">{studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Check-in Session</span>
                <span className="font-mono text-slate">2026 – 27</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Curfew</span>
                <span className="font-mono text-slate">8:30 PM daily</span>
              </div>
            </div>
          </>
        ) : (
          <div className="py-3">
            <p className="font-display font-bold text-xl text-slate">Awaiting Allotment</p>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              {status === "pending"
                ? "You'll be notified once the next FCFS allotment run completes. Keep your preferences updated."
                : "No room matched your preferences. Please visit the admin office for assistance."}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-paper border-t border-line flex items-center justify-between relative z-10">
        <span className="text-[10px] font-mono text-muted uppercase tracking-widest">PCTE-HRA</span>
        <span className="text-[10px] text-muted font-mono">Ludhiana · Punjab</span>
      </div>
    </div>
  );
}
