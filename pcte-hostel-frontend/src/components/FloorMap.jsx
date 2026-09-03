import { useState } from "react";
import { ShieldAlert, Sparkles, Layers, Droplet, Building2, DoorOpen } from "lucide-react";

export default function FloorMap({
  rooms = [],
  highlightRoomNumber = null,
  selectedBlock = "Block B",
  onRoomSelect = null,
}) {
  const [activeFloor, setActiveFloor] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const floorRooms = rooms.filter(
    (r) =>
      r.block.toLowerCase() === selectedBlock.toLowerCase() &&
      (r.floor === activeFloor ||
        r.room.startsWith(`B-${activeFloor}`) ||
        r.room.startsWith(`A-${activeFloor}`) ||
        r.room.startsWith(`C-0${activeFloor}`))
  );

  const northRooms = floorRooms.filter((_, idx) => idx % 2 === 0);
  const southRooms = floorRooms.filter((_, idx) => idx % 2 !== 0);

  function getRoomStatus(r) {
    if (r.maintenance) return "maintenance";
    if (r.occupied === 0) return "vacant";
    if (r.occupied < r.capacity) return "partial";
    return "full";
  }

  const STATUS_CONFIG = {
    vacant: {
      bg:    "bg-emerald-50 text-emerald-900 hover:border-emerald-400",
      pill:  "bg-emerald-100 text-emerald-800",
      dot:   "bg-emerald-500",
      label: "Vacant",
    },
    partial: {
      bg:    "bg-amber-50 text-amber-900 hover:border-amber-400",
      pill:  "bg-amber-100 text-amber-800",
      dot:   "bg-amber-500",
      label: "Partial",
    },
    full: {
      bg:    "bg-rose-50 text-rose-900 hover:border-rose-400",
      pill:  "bg-red-100 text-red-800",
      dot:   "bg-red-500",
      label: "Full",
    },
    maintenance: {
      bg:    "bg-amber-50 text-amber-900 hover:border-amber-400",
      pill:  "bg-orange-100 text-orange-800",
      dot:   "bg-orange-500",
      label: "Maintenance",
    },
  };

  function handleRoomClick(room) {
    setSelectedRoom(room);
    if (onRoomSelect) onRoomSelect(room);
  }

  function RoomCell({ rm }) {
    const status = getRoomStatus(rm);
    const cfg    = STATUS_CONFIG[status];
    const isMine = highlightRoomNumber && rm.room.toLowerCase() === highlightRoomNumber.toLowerCase();

    return (
      <button
        type="button"
        onClick={() => handleRoomClick(rm)}
        className={`relative p-3 rounded-lg border-2 text-left transition-all duration-150 cursor-pointer ${cfg.bg} ${
          isMine ? "border-brand ring-2 ring-brand/30 shadow-md" : "border-transparent shadow-sm hover:shadow-md"
        }`}
        style={isMine ? {} : { borderColor: "#E2E8F0" }}
      >
        {isMine && (
          <span className="absolute -top-2.5 right-1.5 bg-brand text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide shadow-sm flex items-center gap-0.5">
            <Sparkles size={8} /> You
          </span>
        )}
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono font-bold text-sm">{rm.room}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${cfg.pill}`}>
            {rm.occupied}/{rm.capacity}
          </span>
        </div>
        <p className="text-[11px] opacity-70 mt-0.5">{rm.type} Sharing</p>
        <div className="flex items-center gap-1 mt-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
          <p className="text-[10px] font-mono opacity-60 truncate">
            {rm.students.length > 0 ? rm.students[0] : "Vacant"}
          </p>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-card border border-line rounded-xl overflow-hidden card-elevated">
      {/* Header */}
      <div className="px-6 py-4 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand/8 border border-brand/15 flex items-center justify-center shrink-0">
            <Layers size={16} className="text-brand" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-navy">{selectedBlock} · Interactive Floor Plan</h3>
            <p className="text-xs text-muted">Click any room to inspect occupancy and resident details.</p>
          </div>
        </div>

        {/* Floor Switcher */}
        <div className="flex items-center gap-1 bg-bg border border-line p-1 rounded-lg shrink-0">
          {[1, 2, 3].map((fl) => (
            <button
              key={fl}
              type="button"
              onClick={() => setActiveFloor(fl)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all duration-150 ${
                activeFloor === fl ? "bg-navy text-white shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              Floor {fl}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-b border-line bg-bg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-4 text-[11px] font-mono text-muted">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-sm ${cfg.dot}`} />
              {cfg.label}
            </span>
          ))}
        </div>
        {highlightRoomNumber && (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-brand bg-brand/8 border border-brand/20 px-2.5 py-1 rounded-full">
            <Sparkles size={11} /> Your Room: {highlightRoomNumber}
          </span>
        )}
      </div>

      {/* Floor Layout */}
      <div className="p-5 overflow-x-auto bg-paper/30">
        <div className="min-w-[640px] space-y-4">
          {/* North Wing */}
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted px-1">
            <span>North Wing / Courtyard View</span>
            <span className="bg-card border border-line px-2 py-0.5 rounded text-[10px]">Even rooms</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {northRooms.map((rm) => <RoomCell key={rm.room} rm={rm} />)}
            {northRooms.length === 0 && (
              <div className="col-span-4 text-center py-6 text-xs text-muted italic">No rooms on this wing for Floor {activeFloor}</div>
            )}
          </div>

          {/* Central Corridor */}
          <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate/70">
            <div className="flex items-center gap-3">
              <span className="bg-card border border-line px-2.5 py-1 rounded text-[11px] font-semibold text-slate flex items-center gap-1.5"><Building2 size={11} /> Lift & Stairs</span>
              <span className="flex items-center gap-1 bg-card border border-line px-2 py-1 rounded text-[11px] text-slate">
                <Droplet size={11} className="text-brand" /> RO Water
              </span>
            </div>
            <span className="font-bold tracking-widest text-slate/50 text-[10px] uppercase">Central Corridor / Floor {activeFloor}</span>
            <div className="flex items-center gap-2">
              <span className="bg-card border border-line px-2.5 py-1 rounded text-[11px] font-semibold text-slate flex items-center gap-1.5"><DoorOpen size={11} /> Washrooms</span>
            </div>
          </div>

          {/* South Wing */}
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted px-1">
            <span>South Wing / Garden View</span>
            <span className="bg-card border border-line px-2 py-0.5 rounded text-[10px]">Odd rooms</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {southRooms.map((rm) => <RoomCell key={rm.room} rm={rm} />)}
            {southRooms.length === 0 && (
              <div className="col-span-4 text-center py-6 text-xs text-muted italic">No rooms on this wing for Floor {activeFloor}</div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Room Detail Panel */}
      {selectedRoom && (
        <div className="px-6 py-4 border-t border-line bg-paper flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="space-y-1.5">
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-mono font-extrabold text-lg text-navy">{selectedRoom.room}</span>
              <span className="text-xs text-muted">({selectedRoom.block} · Floor {selectedRoom.floor || activeFloor})</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${STATUS_CONFIG[getRoomStatus(selectedRoom)].pill}`}>
                {STATUS_CONFIG[getRoomStatus(selectedRoom)].label}
              </span>
              {selectedRoom.maintenance && (
                <span className="flex items-center gap-1 text-xs text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">
                  <ShieldAlert size={12} /> Under Maintenance
                </span>
              )}
            </div>
            <div className="text-xs text-muted flex flex-wrap items-center gap-2">
              <span>Type: <b className="text-ink">{selectedRoom.type} Sharing</b></span>
              <span className="text-line">•</span>
              <span>Capacity: <b className="text-ink">{selectedRoom.capacity} beds ({selectedRoom.capacity - selectedRoom.occupied} free)</b></span>
              <span className="text-line">•</span>
              <span>Residents: <b className="text-ink">{selectedRoom.students.length ? selectedRoom.students.join(", ") : "None (Vacant)"}</b></span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedRoom(null)}
            className="text-xs border border-line bg-card rounded-lg px-3 py-1.5 text-muted hover:text-ink hover:bg-bg transition-colors shrink-0"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
