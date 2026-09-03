import { useState } from "react";
import { X, ArrowRightLeft, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RoomChangeModal({ isOpen, onClose, student, currentRoom, availableRooms = [], onSubmit }) {
  const [targetRoom, setTargetRoom] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!targetRoom.trim()) {
      setError("Please select or specify a target room.");
      return;
    }
    if (targetRoom.trim().toLowerCase() === currentRoom?.toLowerCase()) {
      setError("Target room cannot be the same as your current room.");
      return;
    }
    if (!reason.trim()) {
      setError("Please provide a reason for the room change.");
      return;
    }

    setError("");
    onSubmit({
      studentName: student.name,
      collegeId: student.collegeId,
      fromRoom: currentRoom,
      toRoom: targetRoom.trim(),
      reason: reason.trim(),
    });
    setSubmitted(true);
  }

  function handleClose() {
    setSubmitted(false);
    setError("");
    setTargetRoom("");
    setReason("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkdeep/70 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-line shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={18} className="text-brass" />
            <h3 className="font-display text-lg text-ink">Request Room Change</h3>
          </div>
          <button onClick={handleClose} className="text-muted hover:text-slate p-1 rounded">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-confirmed/10 text-confirmed flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="font-display text-lg text-ink">Request Submitted</p>
              <p className="text-sm text-muted mt-1">
                Your request to transfer from <span className="font-mono font-medium text-slate">{currentRoom}</span> to{" "}
                <span className="font-mono font-medium text-slate">{targetRoom}</span> has been routed to the Hostel
                Admin Office.
              </p>
            </div>
            <p className="text-xs text-muted">You will see your updated room card as soon as the admin reviews and approves the request.</p>
            <button
              onClick={handleClose}
              className="w-full bg-ink text-white py-2.5 rounded text-sm font-medium hover:bg-inkdeep transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-start gap-2 bg-rejected/10 border border-rejected/30 rounded p-3 text-xs text-rejected">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
                Current Room
              </label>
              <input
                value={currentRoom || "B-214"}
                disabled
                className="w-full border border-line bg-paper/60 rounded px-3 py-2 text-sm font-mono text-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
                Desired Room / Block
              </label>
              {availableRooms.length > 0 ? (
                <select
                  value={targetRoom}
                  onChange={(e) => setTargetRoom(e.target.value)}
                  className="w-full border border-line rounded px-3 py-2 text-sm bg-white font-mono"
                  required
                >
                  <option value="">Select an available room…</option>
                  {availableRooms
                    .filter((rm) => rm.room.toLowerCase() !== currentRoom?.toLowerCase() && !rm.maintenance && rm.occupied < rm.capacity)
                    .map((rm) => (
                      <option key={rm.room} value={rm.room}>
                        {rm.room} ({rm.block} · {rm.type} · {rm.capacity - rm.occupied} bed available)
                      </option>
                    ))}
                  <option value="B-201">B-201 (Block B · Double)</option>
                  <option value="B-204">B-204 (Block B · Single)</option>
                  <option value="A-108">A-108 (Block A · Double)</option>
                  <option value="C-046">C-046 (Block C · Double)</option>
                </select>
              ) : (
                <input
                  value={targetRoom}
                  onChange={(e) => setTargetRoom(e.target.value)}
                  placeholder="e.g. B-204 or A-108"
                  className="w-full border border-line rounded px-3 py-2 text-sm font-mono"
                  required
                />
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
                Reason for Change Request
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Mutual swap with classmate, preferred floor, medical requirement…"
                rows={3}
                className="w-full border border-line rounded px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 border border-line rounded py-2 text-sm text-muted hover:text-slate"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-brass text-white py-2 rounded text-sm font-medium hover:bg-brassLight transition-colors"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
