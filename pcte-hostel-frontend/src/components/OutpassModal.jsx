import { X, Printer, QrCode, ShieldCheck, CheckCircle2, AlertTriangle, Calendar, Clock, MapPin, User, Phone } from "lucide-react";

export default function OutpassModal({ isOpen, onClose, outpass }) {
  if (!isOpen || !outpass) return null;

  function handlePrint() {
    window.print();
  }

  const isApproved = outpass.status === "approved" || outpass.status === "checked_out";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkdeep/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg border border-line shadow-2xl max-w-lg w-full overflow-hidden my-6 animate-in fade-in zoom-in duration-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper print:hidden">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-brass" />
            <h3 className="font-display text-base text-ink font-semibold">Digital Hostel Gate Pass</h3>
          </div>
          <div className="flex items-center gap-2">
            {isApproved && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-xs bg-ink text-white px-3 py-1.5 rounded hover:bg-inkdeep transition-colors"
              >
                <Printer size={14} /> Print Pass
              </button>
            )}
            <button onClick={onClose} className="text-muted hover:text-slate p-1 rounded">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Pass Body */}
        <div className="p-6 text-slate space-y-5 bg-white">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <div className="inline-block bg-ink text-brassLight font-display font-bold text-xs px-2.5 py-0.5 rounded mb-1">
              PCTE RESIDENCE · GATE PASS
            </div>
            <h2 className="font-display text-xl font-bold text-ink uppercase tracking-wide">
              Official Campus Exit Slip
            </h2>
            <p className="text-xs text-muted">Pass ID: {outpass.id}</p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 ${
                outpass.status === "approved"
                  ? "bg-confirmed/15 text-confirmed border border-confirmed/30"
                  : outpass.status === "pending"
                  ? "bg-pending/15 text-pending border border-pending/30"
                  : "bg-rejected/15 text-rejected border border-rejected/30"
              }`}
            >
              {outpass.status === "approved" ? (
                <>
                  <CheckCircle2 size={14} /> APPROVED BY WARDEN
                </>
              ) : outpass.status === "pending" ? (
                <>
                  <Clock size={14} /> PENDING WARDEN APPROVAL
                </>
              ) : (
                <>
                  <AlertTriangle size={14} /> REJECTED / INVALID
                </>
              )}
            </div>
          </div>

          {/* QR Code & Main Pass Data */}
          <div className="bg-paper border border-line rounded-lg p-4 flex flex-col sm:flex-row items-center gap-5">
            {/* Mock High-Res QR Code */}
            <div className="p-2.5 bg-white border border-line rounded shadow-2xs flex flex-col items-center justify-center shrink-0">
              <div className="w-24 h-24 bg-ink/5 border border-dashed border-ink/20 rounded flex items-center justify-center text-center p-2">
                <QrCode size={64} className="text-ink" />
              </div>
              <span className="text-[9px] font-mono text-muted mt-1 uppercase">Gate Scan OK</span>
            </div>

            <div className="flex-1 space-y-1.5 text-xs w-full">
              <div className="flex justify-between border-b border-line/60 pb-1">
                <span className="text-muted">Student:</span>
                <span className="font-bold text-slate">{outpass.student}</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-1">
                <span className="text-muted">College ID:</span>
                <span className="font-mono font-semibold text-ink">{outpass.collegeId}</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-1">
                <span className="text-muted">Residence:</span>
                <span className="font-mono text-slate">{outpass.block} · {outpass.room}</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-1">
                <span className="text-muted">Pass Category:</span>
                <span className="font-semibold text-brass">{outpass.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Approved By:</span>
                <span className="text-slate font-medium">{outpass.approvedBy || "Awaiting signature"}</span>
              </div>
            </div>
          </div>

          {/* Timing & Destination Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-paper/60 border border-line rounded p-3 space-y-1">
              <span className="text-muted flex items-center gap-1 font-mono uppercase tracking-wider text-[10px]">
                <Calendar size={11} className="text-brass" /> Departure Window
              </span>
              <p className="font-semibold text-slate">{outpass.departureTime}</p>
            </div>
            <div className="bg-paper/60 border border-line rounded p-3 space-y-1">
              <span className="text-muted flex items-center gap-1 font-mono uppercase tracking-wider text-[10px]">
                <Clock size={11} className="text-brass" /> Expected Return (Curfew)
              </span>
              <p className="font-semibold text-slate">{outpass.expectedReturn}</p>
            </div>
          </div>

          <div className="text-xs space-y-2 border-t border-line pt-3">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-brass shrink-0 mt-0.5" />
              <div>
                <span className="text-muted">Destination: </span>
                <span className="font-medium text-slate">{outpass.destination}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone size={14} className="text-brass shrink-0 mt-0.5" />
              <div>
                <span className="text-muted">Parent / Emergency Contact: </span>
                <span className="font-mono text-slate">{outpass.parentContact}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User size={14} className="text-brass shrink-0 mt-0.5" />
              <div>
                <span className="text-muted">Reason / Purpose: </span>
                <span className="text-slate">{outpass.purpose}</span>
              </div>
            </div>
          </div>

          {/* Security Instruction Footer */}
          <div className="border-t border-dashed border-line pt-3 flex items-center justify-between text-[11px] text-muted font-mono">
            <span>Main Gate Security Check Required</span>
            <span className="flex items-center gap-1 text-confirmed">
              <ShieldCheck size={13} /> Biometric Match Valid
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
