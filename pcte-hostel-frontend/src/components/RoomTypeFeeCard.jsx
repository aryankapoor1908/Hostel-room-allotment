import { useState } from "react";
import { BedDouble } from "lucide-react";
import { ROOM_TYPES } from "../constants/roomTypes";

export { ROOM_TYPES };

function Row({ label, fan, ac }) {
  return (
    <div className="grid grid-cols-3 border-t border-line text-sm">
      <div className="px-5 py-3 font-semibold text-slate bg-paper/60">{label}</div>
      <div className="px-5 py-3 text-center text-slate">{fan}</div>
      <div className="px-5 py-3 text-center text-slate">{ac}</div>
    </div>
  );
}

export default function RoomTypeFeeCard() {
  const [activeKey, setActiveKey] = useState(ROOM_TYPES[0].key);
  const active = ROOM_TYPES.find((r) => r.key === activeKey);

  return (
    <div className="bg-white border border-line rounded overflow-hidden max-w-3xl shadow-sm">
      <div className="flex items-center gap-2 px-6 py-4 border-l-4 border-brass">
        <BedDouble size={18} className="text-ink" />
        <p className="font-display text-lg text-ink">{active.label}</p>
      </div>

      <div className="grid grid-cols-3 bg-ink text-brassLight text-xs uppercase tracking-wide font-semibold">
        <div className="px-5 py-3">For Academic Year<br /><span className="normal-case font-normal text-white/60">(Ten Months / Till Examination)</span></div>
        <div className="px-5 py-3 text-center">Fan</div>
        <div className="px-5 py-3 text-center">AC</div>
      </div>

      <Row label="FEE 2026" fan={active.fee.fan} ac={active.fee.ac} />
      <Row label="1st Installment" fan={active.installment1.fan} ac={active.installment1.ac} />
      <Row label="2nd Installment" fan={active.installment2.fan} ac={active.installment2.ac} />
      <Row
        label="Availability (For Boys)"
        fan={active.availableBoys ? "Available" : "—"}
        ac={active.availableBoys ? "Available" : "—"}
      />
      <Row
        label="Availability (For Girls)"
        fan={active.availableGirls ? "Available" : "—"}
        ac={active.availableGirls ? "Available" : "—"}
      />

      <div className="border-t border-line">
        {ROOM_TYPES.filter((r) => r.key !== activeKey).map((r) => (
          <button
            key={r.key}
            onClick={() => setActiveKey(r.key)}
            className="w-full flex items-center gap-2 px-6 py-3 text-sm text-ink hover:bg-paper transition-colors border-b border-line last:border-b-0"
          >
            <BedDouble size={15} className="text-muted" />
            {r.label}
          </button>
        ))}
      </div>

      <p className="px-6 py-3 text-xs text-brass font-medium flex items-center gap-1.5 bg-paper/60">
        ✓ Including Food
      </p>
    </div>
  );
}
