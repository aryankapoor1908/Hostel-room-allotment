import { X, Printer, ClipboardCheck, ShieldCheck, Check } from "lucide-react";

export default function CheckinInventoryModal({ isOpen, onClose, student, items = [], onToggleVerify }) {
  if (!isOpen) return null;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkdeep/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg border border-line shadow-2xl max-w-2xl w-full overflow-hidden my-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper print:hidden">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={18} className="text-brass" />
            <h3 className="font-display text-base text-ink font-semibold">
              Room Inventory Inspection & No-Dues Clearance
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs bg-ink text-white px-3 py-1.5 rounded hover:bg-inkdeep transition-colors"
            >
              <Printer size={14} /> Print Clearance Slip
            </button>
            <button onClick={onClose} className="text-muted hover:text-slate p-1 rounded">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 text-slate space-y-5 bg-white">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h2 className="font-display text-xl font-bold text-ink uppercase tracking-wide">
              PCTE Hostel Residence — Room Handover Record
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Official Property Verification & Clearance Form · Session 2026–27
            </p>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-paper border border-line rounded p-3 font-mono">
            <div>
              <span className="text-muted block text-[10px] uppercase">Resident</span>
              <span className="font-bold text-slate">{student?.name || "Aryan Kapoor"}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">College ID</span>
              <span className="font-bold text-ink">{student?.collegeId || "BCA0140"}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Hostel Block</span>
              <span className="font-bold text-slate">{student?.block || "Block B"}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Room Assigned</span>
              <span className="font-bold text-brass">{student?.room || "B-214"}</span>
            </div>
          </div>

          <p className="text-xs text-slate leading-relaxed">
            All furniture, electrical fittings, and keys assigned to this room have been inspected. Any pre-existing damage
            is recorded below. Residents are responsible for the upkeep of these fixtures.
          </p>

          {/* Inventory Table */}
          <div className="border border-line rounded overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-paper border-b border-line text-muted uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-2.5">Fixture / Item</th>
                  <th className="p-2.5">Serial / Tag</th>
                  <th className="p-2.5">Condition at Handover</th>
                  <th className="p-2.5 text-center">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-paper/30">
                    <td className="p-2.5 font-medium text-slate">{item.item}</td>
                    <td className="p-2.5 font-mono text-muted text-[11px]">{item.serial}</td>
                    <td className="p-2.5 text-slate">{item.condition}</td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleVerify && onToggleVerify(item.id, !item.verified)}
                        className={`w-5 h-5 rounded border inline-flex items-center justify-center transition-colors ${
                          item.verified ? "bg-confirmed border-confirmed text-white" : "border-line bg-white"
                        }`}
                      >
                        {item.verified && <Check size={12} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-line pt-4 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
            <div>
              <p className="text-[11px] text-muted mb-6 flex items-center gap-1">
                <ShieldCheck size={14} className="text-confirmed" /> Resident acceptance confirmed digitally on login.
              </p>
              <div className="w-32 border-b border-slate"></div>
              <p className="font-medium text-slate mt-1">{student?.name} (Resident)</p>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-slate ml-auto mb-1"></div>
              <p className="font-medium text-slate">Block Warden / Estate Supervisor</p>
              <p className="text-[10px] text-muted">PCTE Residence Administration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
