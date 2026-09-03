import { useState } from "react";
import { X, Wrench, AlertCircle, Zap, Droplets, Hammer, Wifi, Sparkles } from "lucide-react";

const CATEGORIES = [
  { key: "Electrical", label: "Electrical (Fan, AC, Lights)", icon: Zap },
  { key: "Plumbing", label: "Plumbing (Tap, Flush, Leakage)", icon: Droplets },
  { key: "Carpentry", label: "Carpentry (Bed, Desk, Wardrobe)", icon: Hammer },
  { key: "Wi-Fi / Internet", label: "Wi-Fi / Internet Connectivity", icon: Wifi },
  { key: "Housekeeping", label: "Housekeeping & Cleanliness", icon: Sparkles },
];

export default function ComplaintModal({ isOpen, onClose, student, onSubmit }) {
  const [category, setCategory] = useState("Electrical");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please specify a brief issue title.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe the problem.");
      return;
    }

    setError("");
    onSubmit({
      student: student.name,
      collegeId: student.collegeId,
      room: student.room,
      block: student.block,
      category,
      title: title.trim(),
      description: description.trim(),
      priority,
    });

    setTitle("");
    setDescription("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkdeep/70 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-line shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper">
          <div className="flex items-center gap-2">
            <Wrench size={18} className="text-brass" />
            <h3 className="font-display text-base text-ink font-semibold">Report Room Maintenance Issue</h3>
          </div>
          <button onClick={onClose} className="text-muted hover:text-slate p-1 rounded">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate">
          {error && (
            <div className="flex items-center gap-2 bg-rejected/10 border border-rejected/30 text-rejected rounded p-3 text-xs">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
              Select Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`flex items-center gap-2 p-2.5 rounded border text-left text-xs transition-colors ${
                      isSelected
                        ? "border-brass bg-brass/10 text-ink font-semibold"
                        : "border-line text-muted hover:border-slate/40"
                    }`}
                  >
                    <Icon size={15} className={isSelected ? "text-brass" : "text-muted"} />
                    <span>{cat.key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
              Issue Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AC cooling low / Remote battery dead"
              className="w-full border border-line rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
                Room Number
              </label>
              <input
                value={`${student?.room || "B-214"} (${student?.block || "Block B"})`}
                disabled
                className="w-full border border-line bg-paper/60 rounded px-3 py-2 text-sm font-mono text-muted cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
                Urgency Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
              >
                <option value="Low">Low (Convenience)</option>
                <option value="Medium">Medium (Affecting study/rest)</option>
                <option value="Urgent">Urgent (Immediate repair)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
              Detailed Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail so the technician brings the correct tools/spares…"
              rows={3}
              className="w-full border border-line rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-line rounded py-2 text-sm text-muted hover:text-slate"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-brass text-white py-2 rounded text-sm font-medium hover:bg-brassLight transition-colors"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
