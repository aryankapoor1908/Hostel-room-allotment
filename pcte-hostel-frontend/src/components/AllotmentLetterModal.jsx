import { X, Printer, CheckCircle, FileText } from "lucide-react";

export default function AllotmentLetterModal({ isOpen, onClose, student, allotment }) {
  if (!isOpen) return null;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkdeep/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg border border-line shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper print:hidden">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-brass" />
            <h3 className="font-display text-lg text-ink">Hostel Allotment Letter</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs bg-ink text-white px-3 py-1.5 rounded hover:bg-inkdeep transition-colors"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="text-muted hover:text-slate p-1 rounded">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 text-slate space-y-6 bg-white">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-ink pb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-ink text-brassLight font-display font-bold text-lg rounded mb-2">
              PCTE
            </div>
            <h1 className="font-display text-2xl font-bold text-ink uppercase tracking-wide">
              PCTE Group of Institutes
            </h1>
            <p className="text-xs text-muted">
              Campus: Baddowal–Ferozepur Road, Ludhiana – 142021, Punjab, India
            </p>
            <p className="text-xs text-muted">
              Approved by AICTE · Affiliated to IKG Punjab Technical University
            </p>
            <div className="mt-3 inline-block bg-paper px-4 py-1 rounded text-xs font-mono font-semibold text-ink uppercase tracking-widest border border-line">
              Official Hostel Allotment Order · Academic Session 2026–27
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-muted">
            <span>Ref No: PCTE/HRA/2026/0{student?.collegeId || "140"}</span>
            <span>Date: {today}</span>
          </div>

          <p className="text-sm leading-relaxed">
            This is to certify that the following student has been formally allotted accommodation in
            the PCTE Campus Residence for the Academic Session 2026–27:
          </p>

          <div className="border border-line rounded overflow-hidden text-sm">
            <div className="grid grid-cols-2 border-b border-line bg-paper/60 px-4 py-2.5">
              <span className="text-muted font-medium">Student Name:</span>
              <span className="font-semibold text-ink">{student?.name || "Aryan Kapoor"}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-line px-4 py-2.5">
              <span className="text-muted font-medium">College Registration ID:</span>
              <span className="font-mono font-semibold text-ink">{student?.collegeId || "BCA0140"}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-line bg-paper/60 px-4 py-2.5">
              <span className="text-muted font-medium">Allotted Hostel Block:</span>
              <span className="font-semibold text-ink">{allotment?.hostelBlock || student?.block || "Block B"}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-line px-4 py-2.5">
              <span className="text-muted font-medium">Allotted Room Number:</span>
              <span className="font-mono font-bold text-brass text-base">{allotment?.roomNumber || student?.room || "B-214"}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-line bg-paper/60 px-4 py-2.5">
              <span className="text-muted font-medium">Room Type & Sharing:</span>
              <span className="font-semibold text-ink">{allotment?.roomType || student?.roomType || "Double sharing"}</span>
            </div>
            <div className="grid grid-cols-2 px-4 py-2.5">
              <span className="text-muted font-medium">Fee Confirmation Status:</span>
              <span className="font-semibold text-confirmed flex items-center gap-1.5">
                <CheckCircle size={14} /> {student?.feeStatus === "paid" ? "Confirmed / Paid" : "Provisional (Installment Pending)"}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-muted border-t border-line pt-4">
            <p className="font-semibold text-slate uppercase tracking-wide">Key Terms & Check-in Instructions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Present this allotment slip along with government ID proof (Aadhaar / Passport) to the Block Warden.</li>
              <li>Hostel gates close strictly at 8:30 PM daily. Regular biometric/attendance logging is compulsory.</li>
              <li>Ragging in any form is strictly prohibited under institute and UGC anti-ragging regulations.</li>
              <li>Meals (breakfast, lunch, evening tea, and dinner) are included in the hostel fee structure.</li>
            </ul>
          </div>

          <div className="pt-8 flex justify-between items-end border-t border-line text-xs">
            <div>
              <div className="w-24 border-b border-slate mb-1"></div>
              <p className="font-semibold text-slate">Student Signature</p>
              <p className="text-[11px] text-muted">{student?.name}</p>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-slate mb-1 ml-auto"></div>
              <p className="font-semibold text-slate">Chief Hostel Warden</p>
              <p className="text-[11px] text-muted">PCTE Residence Administration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
