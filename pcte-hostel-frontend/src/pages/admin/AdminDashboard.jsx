import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import FloorMap from "../../components/FloorMap";
import OutpassModal from "../../components/OutpassModal";
import { useHostelData } from "../../context/HostelDataContext";
import {
  Play,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Wrench,
  ShieldCheck,
  UserPlus,
  X,
  Building,
  Loader2,
  QrCode,
  Check,
  Calendar,
} from "lucide-react";

const NAV = [
  { key: "overview", label: "Overview" },
  { key: "inventory", label: "Hostels & Floor Plan" },
  { key: "students", label: "Students" },
  { key: "outpasses", label: "Outpass Approvals" },
  { key: "maintenance", label: "Maintenance Desk" },
  { key: "attendance", label: "Night Roll Call" },
  { key: "mess", label: "Mess Forecast" },
  { key: "notices", label: "Notice Publisher" },
  { key: "requests", label: "Room Requests" },
  { key: "payments", label: "Payments" },
];

const FEE_STYLES = {
  paid: "bg-confirmed/10 text-confirmed",
  unpaid: "bg-rejected/10 text-rejected",
  pending: "bg-pending/10 text-pending",
};

const EMPTY_FORM = {
  name: "",
  collegeId: "",
  block: "Block B",
  room: "",
  roomType: "Double",
  feeStatus: "unpaid",
  status: "allotted",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted uppercase tracking-wide">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [running, setRunning] = useState(false);
  const [runMessage, setRunMessage] = useState("");
  const [query, setQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  // Modals & views
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockRooms, setNewBlockRooms] = useState("15");
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceRoom, setMaintenanceRoom] = useState("");
  const [selectedInventoryBlock, setSelectedInventoryBlock] = useState("Block B");
  const [activeQrOutpass, setActiveQrOutpass] = useState(null);

  // Notice Publisher state
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeBody, setNoticeBody] = useState("");
  const [noticeCategory, setNoticeCategory] = useState("General");
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  // Attendance date
  const todayKey = new Date().toISOString().split("T")[0];
  const [attendanceDate, setAttendanceDate] = useState(todayKey);

  const {
    students,
    rooms,
    hostels,
    requests,
    outpasses,
    complaints,
    notices,
    mealSkips,
    attendance,
    runAllotment,
    resolveRequest,
    resolveOutpass,
    assignComplaint,
    updateComplaintStatus,
    postNotice,
    deleteNotice,
    markAttendance,
    cycleFeeStatus,
    addStudent,
    addHostelBlock,
    flagMaintenance,
  } = useHostelData();

  // Dynamic calculations
  const totalBeds = rooms.reduce((acc, r) => acc + (r.capacity || 1), 0);
  const allottedCount = students.filter((s) => s.status === "allotted" && s.room !== "Unassigned").length;
  const pendingCount = students.filter((s) => s.status === "pending").length;
  const paidCount = students.filter((s) => s.feeStatus === "paid").length;
  const feesInLakhs = ((paidCount * 60000) / 100000).toFixed(1);

  // Operations stats
  const pendingOutpassesCount = outpasses.filter((o) => o.status === "pending").length;
  const activeComplaintsCount = complaints.filter((c) => c.status !== "resolved").length;

  // Mess skips count
  const allSkips = Object.values(mealSkips).flat();
  const dinnerSkipsCount = allSkips.filter((k) => k.includes("dinner")).length;
  const estimatedDinnerDiners = Math.max(0, allottedCount - dinnerSkipsCount);

  // Attendance stats
  const currentDayAttendance = attendance[attendanceDate] || {};
  const presentCount = Object.values(currentDayAttendance).filter((s) => s === "present").length;
  const leaveCount = Object.values(currentDayAttendance).filter((s) => s === "leave").length;
  const absentCount = Object.values(currentDayAttendance).filter((s) => s === "absent").length;

  const STATS = [
    { label: "Total capacity", value: `${totalBeds} beds` },
    { label: "Allotted residents", value: String(allottedCount) },
    { label: "Pending outpasses", value: String(pendingOutpassesCount) },
    { label: "Open maintenance", value: String(activeComplaintsCount) },
  ];

  function handleRunAllotment() {
    setRunning(true);
    setRunMessage("");
    setTimeout(() => {
      const allottedNow = runAllotment();
      setRunning(false);
      if (allottedNow > 0) {
        setRunMessage(`Allotment run completed: Assigned ${allottedNow} pending student(s) to vacant rooms.`);
      } else {
        setRunMessage("Allotment run completed: All eligible students are already assigned.");
      }
    }, 1200);
  }

  function handleFormChange(field, value) {
    setFormData((f) => ({ ...f, [field]: value }));
  }

  function handleAddStudent(e) {
    e.preventDefault();
    const name = formData.name.trim();
    const collegeId = formData.collegeId.trim();
    const room = formData.room.trim();

    if (!name || !collegeId || !room) {
      setFormError("Name, college ID, and room are all required.");
      return;
    }
    if (students.some((s) => s.collegeId.toLowerCase() === collegeId.toLowerCase())) {
      setFormError(`A student with college ID "${collegeId}" already exists.`);
      return;
    }

    addStudent({ ...formData, name, collegeId, room });
    setFormData(EMPTY_FORM);
    setFormError("");
    setShowAddForm(false);
  }

  function handleCancelAdd() {
    setFormData(EMPTY_FORM);
    setFormError("");
    setShowAddForm(false);
  }

  function handleCreateBlock(e) {
    e.preventDefault();
    if (!newBlockName.trim()) return;
    addHostelBlock({ name: newBlockName.trim(), totalRooms: Number(newBlockRooms) || 15 });
    setNewBlockName("");
    setShowAddBlockModal(false);
  }

  function handleToggleMaintenance(roomNumber, currentStatus) {
    flagMaintenance(roomNumber, !currentStatus);
  }

  function handlePublishNotice(e) {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeBody.trim()) return;

    postNotice({
      title: noticeTitle.trim(),
      body: noticeBody.trim(),
      category: noticeCategory,
      author: "Chief Hostel Warden",
    });

    setNoticeTitle("");
    setNoticeBody("");
    setNoticeSuccess(true);
    setTimeout(() => setNoticeSuccess(false), 3500);
  }

  const filteredStudents = students.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.collegeId.toLowerCase().includes(q) ||
      s.block.toLowerCase().includes(q) ||
      s.room.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardShell navItems={NAV} activeKey={active} onNavigate={setActive}>
      {/* 1. OVERVIEW */}
      {active === "overview" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted bg-white border border-line p-4 rounded shadow-2xs">
            <ShieldCheck size={18} className="text-brass shrink-0" />
            <span>Full site control — every block, student record, gate pass, and maintenance ticket runs through this portal.</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white border border-line rounded p-5 shadow-2xs">
                <p className="text-xs text-muted uppercase tracking-wide">{s.label}</p>
                <p className="font-display text-2xl text-ink mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          {runMessage && (
            <div className="flex items-center gap-3 bg-confirmed/10 border border-confirmed/30 text-confirmed rounded p-4 text-sm animate-in fade-in">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{runMessage}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-line rounded p-6 shadow-2xs">
              <h3 className="font-display text-lg text-ink font-semibold">Run Automated Allotment</h3>
              <p className="text-sm text-muted mt-1 mb-4 leading-relaxed">
                Matches registered student preferences against available room inventory, first-come first-served.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunAllotment}
                  disabled={running}
                  className="flex items-center gap-2 bg-brass text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-brassLight transition-colors disabled:opacity-60 shadow-xs"
                >
                  {running ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Processing Allotment…
                    </>
                  ) : (
                    <>
                      <Play size={15} /> Run allotment now
                    </>
                  )}
                </button>
                {pendingCount > 0 && (
                  <span className="text-xs text-pending font-mono font-medium">
                    {pendingCount} student(s) waiting in queue
                  </span>
                )}
              </div>
            </div>

            {/* Operational Summary */}
            <div className="bg-white border border-line rounded p-6 shadow-2xs space-y-3 text-xs">
              <h3 className="font-display text-lg text-ink font-semibold">Today's Hostel Living Metrics</h3>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-muted">Total Active Residents:</span>
                <span className="font-bold text-slate font-mono">{allottedCount} Students</span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-muted">Tonight's Estimated Mess Diners:</span>
                <span className="font-bold text-confirmed font-mono">{estimatedDinnerDiners} Meals ({dinnerSkipsCount} skipped)</span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-muted">Pending Gate Outpasses:</span>
                <span className={`font-bold font-mono ${pendingOutpassesCount > 0 ? "text-pending" : "text-slate"}`}>
                  {pendingOutpassesCount} Requests
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Total Hostel Fees Realized:</span>
                <span className="font-bold text-slate font-mono">₹{feesInLakhs} Lakhs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. INVENTORY & FLOOR PLAN */}
      {active === "inventory" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl text-ink">Hostels & 2D Floor Plan</h2>
              <p className="text-sm text-muted">
                Visual corridor mapping, occupancy rates, and maintenance management.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMaintenanceModal(true)}
                className="flex items-center gap-2 text-xs border border-line bg-white rounded px-3 py-2 text-slate hover:bg-paper shadow-2xs"
              >
                <Wrench size={14} className="text-pending" /> Manage Maintenance
              </button>
              <button
                onClick={() => setShowAddBlockModal(true)}
                className="flex items-center gap-1.5 text-xs bg-ink text-white px-3.5 py-2 rounded hover:bg-inkdeep shadow-xs"
              >
                <Plus size={14} /> Add Block
              </button>
            </div>
          </div>

          {/* Block Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {hostels.map((h) => {
              const blockRooms = rooms.filter((r) => r.block.toLowerCase() === h.name.toLowerCase());
              const occupiedBeds = blockRooms.reduce((sum, r) => sum + r.occupied, 0);
              const totalBlockBeds = blockRooms.reduce((sum, r) => sum + r.capacity, 0) || h.rooms;
              const pct = totalBlockBeds > 0 ? Math.round((occupiedBeds / totalBlockBeds) * 100) : 0;
              const isSelected = selectedInventoryBlock === h.name;
              return (
                <button
                  key={h.name}
                  type="button"
                  onClick={() => setSelectedInventoryBlock(h.name)}
                  className={`p-5 rounded-lg border text-left transition-all ${
                    isSelected ? "border-brass bg-brass/5 ring-1 ring-brass shadow-xs" : "bg-white border-line shadow-2xs hover:border-slate/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg text-ink font-semibold">{h.name}</p>
                    {isSelected && <span className="text-[10px] font-mono font-bold text-brass uppercase">Active View</span>}
                  </div>
                  <p className="text-xs text-muted mt-1">{occupiedBeds} / {totalBlockBeds} beds filled</p>
                  <div className="h-1.5 bg-paper rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-brass" style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <p className="text-xs font-mono text-muted mt-1.5">{pct}% occupied</p>
                </button>
              );
            })}
          </div>

          {/* Interactive 2D Floor Plan */}
          <FloorMap
            rooms={rooms}
            selectedBlock={selectedInventoryBlock}
            isAdmin={true}
          />
        </div>
      )}

      {/* 3. REGISTERED STUDENTS */}
      {active === "students" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="font-display text-xl text-ink">Registered students</h2>
              <p className="text-sm text-muted mt-1">
                {students.length} students across all blocks. Click any fee badge to cycle status.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative w-56">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, ID, room…"
                  className="w-full border border-line rounded pl-9 pr-3 py-2 text-sm focus-visible:border-brass bg-white"
                />
              </div>
              <button
                onClick={() => setShowAddForm((v) => !v)}
                className="flex items-center gap-2 text-sm bg-ink text-white px-4 py-2 rounded hover:bg-inkdeep whitespace-nowrap shadow-xs"
              >
                <UserPlus size={15} /> Add student
              </button>
            </div>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleAddStudent}
              className="bg-white border border-line rounded p-5 mb-6 max-w-3xl shadow-xs"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-display text-lg text-ink">New student enrollment</p>
                <button type="button" onClick={handleCancelAdd} className="text-muted hover:text-slate">
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <p className="text-xs text-rejected bg-rejected/10 border border-rejected/30 rounded px-3 py-2 mb-4">
                  {formError}
                </p>
              )}

              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Full name">
                  <input
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="e.g. Simran Kaur"
                    className="w-full border border-line rounded px-3 py-2 text-sm"
                    required
                  />
                </Field>
                <Field label="College ID">
                  <input
                    value={formData.collegeId}
                    onChange={(e) => handleFormChange("collegeId", e.target.value)}
                    placeholder="e.g. BCA0187"
                    className="w-full border border-line rounded px-3 py-2 text-sm font-mono"
                    required
                  />
                </Field>
                <Field label="Room number">
                  <input
                    value={formData.room}
                    onChange={(e) => handleFormChange("room", e.target.value)}
                    placeholder="e.g. B-102"
                    className="w-full border border-line rounded px-3 py-2 text-sm font-mono"
                    required
                  />
                </Field>
                <Field label="Block">
                  <select
                    value={formData.block}
                    onChange={(e) => handleFormChange("block", e.target.value)}
                    className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
                  >
                    {hostels.map((h) => (
                      <option key={h.name} value={h.name}>{h.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Room type">
                  <select
                    value={formData.roomType}
                    onChange={(e) => handleFormChange("roomType", e.target.value)}
                    className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
                  >
                    <option>Single</option>
                    <option>Double</option>
                    <option>Triple</option>
                  </select>
                </Field>
                <Field label="Fee status">
                  <select
                    value={formData.feeStatus}
                    onChange={(e) => handleFormChange("feeStatus", e.target.value)}
                    className="w-full border border-line rounded px-3 py-2 text-sm capitalize bg-white"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </Field>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <button
                  type="submit"
                  className="bg-brass text-white px-5 py-2 rounded text-sm font-medium hover:bg-brassLight transition-colors"
                >
                  Save student
                </button>
                <button
                  type="button"
                  onClick={handleCancelAdd}
                  className="text-sm text-muted hover:text-slate px-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="bg-white border border-line rounded overflow-x-auto shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-paper text-xs uppercase tracking-wide text-muted text-left border-b border-line">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">College ID</th>
                  <th className="px-5 py-3 font-medium">Block</th>
                  <th className="px-5 py-3 font-medium">Room</th>
                  <th className="px-5 py-3 font-medium">Room type</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Fee status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.collegeId} className="border-t border-line hover:bg-paper/40 transition-colors">
                    <td className="px-5 py-3 text-slate font-medium">{s.name}</td>
                    <td className="px-5 py-3 font-mono text-muted">{s.collegeId}</td>
                    <td className="px-5 py-3 text-slate">{s.block}</td>
                    <td className="px-5 py-3 font-mono text-ink font-semibold">{s.room}</td>
                    <td className="px-5 py-3 text-slate">{s.roomType}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded capitalize ${s.status === "allotted" ? "text-confirmed bg-confirmed/10" : "text-pending bg-pending/10"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => cycleFeeStatus(s.collegeId)}
                        title="Click to cycle fee status"
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize hover:opacity-80 transition-opacity ${FEE_STYLES[s.feeStatus]}`}
                      >
                        {s.feeStatus}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-muted">
                      No students match "{query}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. OUTPASS APPROVALS */}
      {active === "outpasses" && (
        <div className="space-y-6 max-w-4xl">
          <div>
            <h2 className="font-display text-xl text-ink">Outpass & Gate Exit Approvals</h2>
            <p className="text-sm text-muted">
              Approve student leaves and night outings. Approved passes generate scannable QR slips for security.
            </p>
          </div>

          <div className="space-y-3">
            {outpasses.map((o) => (
              <div key={o.id} className="bg-white border border-line rounded p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate">{o.student}</span>
                    <span className="text-xs font-mono text-muted">({o.collegeId} · {o.block} {o.room})</span>
                    <span className="text-xs bg-paper px-2 py-0.5 rounded font-mono font-medium">{o.type}</span>
                  </div>
                  <p className="text-xs text-slate">
                    <b>Destination:</b> {o.destination} | <b>Purpose:</b> {o.purpose}
                  </p>
                  <p className="text-[11px] text-muted font-mono">
                    Departure: {o.departureTime} → Return: {o.expectedReturn} | Parent: {o.parentContact}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => setActiveQrOutpass(o)}
                    className="text-xs border border-line bg-white px-2.5 py-1.5 rounded hover:bg-paper flex items-center gap-1 text-slate"
                  >
                    <QrCode size={13} /> QR Pass
                  </button>

                  {o.status === "pending" ? (
                    <>
                      <button
                        onClick={() => resolveOutpass(o.id, "declined")}
                        className="text-xs border border-line px-3 py-1.5 rounded text-rejected hover:bg-rejected/10"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => resolveOutpass(o.id, "approved")}
                        className="text-xs bg-confirmed text-white px-3 py-1.5 rounded font-semibold hover:opacity-90 shadow-xs"
                      >
                        Approve
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        o.status === "approved" ? "bg-confirmed/15 text-confirmed" : "bg-rejected/15 text-rejected"
                      }`}
                    >
                      {o.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MAINTENANCE DESK */}
      {active === "maintenance" && (
        <div className="space-y-6 max-w-4xl">
          <div>
            <h2 className="font-display text-xl text-ink">Maintenance & Repair Desk</h2>
            <p className="text-sm text-muted">
              Assign technicians and track resolutions for student room complaints.
            </p>
          </div>

          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="bg-white border border-line rounded p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-muted uppercase tracking-wider">
                      {c.category} · Room {c.room} ({c.block}) · Ticket #{c.id}
                    </span>
                    <h4 className="font-display text-base text-ink font-semibold mt-0.5">{c.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
                        c.priority === "Urgent" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.priority} Priority
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded font-semibold capitalize ${
                        c.status === "resolved" ? "bg-confirmed/15 text-confirmed" : "bg-pending/15 text-pending"
                      }`}
                    >
                      {c.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate leading-relaxed">{c.description}</p>

                <div className="pt-2 border-t border-line flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted">Assigned Technician:</span>
                    <select
                      value={c.technician}
                      onChange={(e) => assignComplaint(c.id, e.target.value)}
                      className="border border-line rounded px-2 py-1 bg-white text-xs font-medium"
                    >
                      <option value="Unassigned">Select Technician…</option>
                      <option value="Ramesh Kumar (Electrician)">Ramesh Kumar (Electrician)</option>
                      <option value="Surjit Singh (Plumber)">Surjit Singh (Plumber)</option>
                      <option value="Gurmeet Singh (Carpenter)">Gurmeet Singh (Carpenter)</option>
                      <option value="Ankit (IT Network Cell)">Ankit (IT Network Cell)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.status !== "resolved" && (
                      <button
                        onClick={() => updateComplaintStatus(c.id, "resolved")}
                        className="bg-confirmed text-white px-3 py-1 rounded font-semibold text-xs hover:opacity-90 shadow-2xs flex items-center gap-1"
                      >
                        <Check size={12} /> Mark Resolved
                      </button>
                    )}
                    {c.status === "reported" && (
                      <button
                        onClick={() => updateComplaintStatus(c.id, "in_progress")}
                        className="border border-line bg-white px-3 py-1 rounded text-xs text-slate hover:bg-paper"
                      >
                        Mark In Progress
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. NIGHT ROLL CALL & ATTENDANCE */}
      {active === "attendance" && (
        <div className="space-y-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl text-ink">Night Roll Call & Curfew Tracker</h2>
              <p className="text-sm text-muted">
                9:00 PM hostel curfew check. Resident biometric and physical presence record.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-brass" />
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="border border-line rounded px-3 py-1 text-xs font-mono bg-white"
              />
            </div>
          </div>

          {/* Roll Call Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded p-4 text-center">
              <p className="text-xs font-mono uppercase text-emerald-800">Present in Hostel</p>
              <p className="font-display text-2xl font-bold text-emerald-900 mt-1">{presentCount}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
              <p className="text-xs font-mono uppercase text-blue-800">On Approved Outpass</p>
              <p className="font-display text-2xl font-bold text-blue-900 mt-1">{leaveCount}</p>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded p-4 text-center">
              <p className="text-xs font-mono uppercase text-rose-800">Unaccounted / Absent</p>
              <p className="font-display text-2xl font-bold text-rose-900 mt-1">{absentCount}</p>
            </div>
          </div>

          {/* Attendance Sheet */}
          <div className="bg-white border border-line rounded overflow-x-auto shadow-xs">
            <table className="w-full text-xs">
              <thead className="bg-paper border-b border-line text-muted uppercase font-mono">
                <tr>
                  <th className="p-3 text-left">Resident</th>
                  <th className="p-3 text-left">College ID</th>
                  <th className="p-3 text-left">Room</th>
                  <th className="p-3 text-center">9:00 PM Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {students.filter((s) => s.status === "allotted").map((s) => {
                  const currentStatus = (attendance[attendanceDate] && attendance[attendanceDate][s.collegeId]) || "present";
                  return (
                    <tr key={s.collegeId} className="hover:bg-paper/30">
                      <td className="p-3 font-semibold text-slate">{s.name}</td>
                      <td className="p-3 font-mono text-muted">{s.collegeId}</td>
                      <td className="p-3 font-mono text-ink font-semibold">{s.block} · {s.room}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {["present", "leave", "absent"].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => markAttendance(attendanceDate, s.collegeId, st)}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold capitalize transition-colors ${
                                currentStatus === st
                                  ? st === "present"
                                    ? "bg-confirmed text-white"
                                    : st === "leave"
                                    ? "bg-blue-600 text-white"
                                    : "bg-rejected text-white"
                                  : "bg-paper text-slate hover:bg-slate/10"
                              }`}
                            >
                              {st === "leave" ? "On Outpass" : st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. MESS HEADCOUNT FORECAST */}
      {active === "mess" && (
        <div className="space-y-6 max-w-3xl">
          <div>
            <h2 className="font-display text-xl text-ink">Mess Headcount & Kitchen Forecast</h2>
            <p className="text-sm text-muted">
              Live catering headcount based on student meal skip notifications to prevent food wastage.
            </p>
          </div>

          <div className="bg-white border border-line rounded p-6 shadow-xs space-y-4">
            <h3 className="font-display text-base font-semibold text-ink">Today's Meal Preparation Estimates</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-paper border border-line rounded p-4">
                <span className="text-muted block">Dinner Preparation Headcount</span>
                <span className="font-display text-3xl font-bold text-ink mt-1 block">{estimatedDinnerDiners} Plates</span>
                <span className="text-[11px] text-muted">
                  {allottedCount} total residents − {dinnerSkipsCount} students notified away
                </span>
              </div>
              <div className="bg-paper border border-line rounded p-4">
                <span className="text-muted block">Estimated Food Cost Saved</span>
                <span className="font-display text-3xl font-bold text-confirmed mt-1 block">
                  ₹{(dinnerSkipsCount * 90).toLocaleString()}
                </span>
                <span className="text-[11px] text-muted">Saved from raw material wastage</span>
              </div>
            </div>

            <div className="border-t border-line pt-4 space-y-2">
              <h4 className="font-display text-sm font-semibold text-ink">Students Dining Off Campus Today</h4>
              <p className="text-xs text-muted">
                Student IDs: {Object.keys(mealSkips).join(", ") || "None"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8. NOTICE BOARD PUBLISHER */}
      {active === "notices" && (
        <div className="space-y-6 max-w-3xl">
          <div>
            <h2 className="font-display text-xl text-ink">Notice Board Broadcast</h2>
            <p className="text-sm text-muted">
              Publish circulars, sports schedules, and emergency notices to student dashboards.
            </p>
          </div>

          {noticeSuccess && (
            <div className="flex items-center gap-2 bg-confirmed/10 border border-confirmed/30 text-confirmed rounded p-4 text-xs font-medium">
              <CheckCircle2 size={16} /> Notice broadcasted live to all student portals!
            </div>
          )}

          <form onSubmit={handlePublishNotice} className="bg-white border border-line rounded p-5 space-y-4 shadow-xs">
            <h3 className="font-display text-base text-ink font-semibold">Broadcast New Notice</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
                  Notice Title
                </label>
                <input
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Wi-Fi Upgradation & Maintenance Window"
                  className="w-full border border-line rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
                  Category Tag
                </label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value)}
                  className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
                >
                  <option value="General">General</option>
                  <option value="Urgent">Urgent / Curfew</option>
                  <option value="Event">Event / Sports</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
                Notice Content
              </label>
              <textarea
                value={noticeBody}
                onChange={(e) => setNoticeBody(e.target.value)}
                placeholder="Write full circular details here…"
                rows={3}
                className="w-full border border-line rounded px-3 py-2 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-brass text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-brassLight transition-colors shadow-xs"
            >
              Publish Notice Now
            </button>
          </form>

          {/* Active Notices */}
          <div className="space-y-3">
            <h3 className="font-display text-base text-ink font-semibold">Active Notices ({notices.length})</h3>
            {notices.map((n) => (
              <div key={n.id} className="bg-white border border-line rounded p-4 flex justify-between items-start gap-4 shadow-2xs">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper text-slate uppercase font-bold">
                    {n.category}
                  </span>
                  <h4 className="font-semibold text-sm text-ink mt-1">{n.title}</h4>
                  <p className="text-xs text-slate mt-1 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] font-mono text-muted mt-2">{n.date} · {n.author}</p>
                </div>
                <button
                  onClick={() => deleteNotice(n.id)}
                  className="text-xs text-rejected hover:underline shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. ROOM CHANGE REQUESTS */}
      {active === "requests" && (
        <div>
          <h2 className="font-display text-xl text-ink mb-1">Room change requests</h2>
          <p className="text-sm text-muted mb-6">
            Review and approve student room change requests. Approving automatically updates room inventory and student records.
          </p>

          <div className="space-y-3 max-w-2xl">
            {requests.map((r, i) => (
              <div key={r.id || i} className="bg-white border border-line rounded p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate">{r.student}</p>
                    {r.collegeId && <span className="text-xs font-mono text-muted">({r.collegeId})</span>}
                  </div>
                  <p className="text-xs text-muted font-mono mt-1">
                    Transfer: <span className="font-semibold text-ink">{r.from}</span> → <span className="font-semibold text-brass">{r.to}</span>
                  </p>
                  <p className="text-xs text-slate mt-1 bg-paper px-2.5 py-1 rounded w-fit">
                    Reason: {r.reason}
                  </p>
                </div>

                {r.status === "pending" ? (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => resolveRequest(r.id || i, "declined")}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-line text-muted hover:text-rejected transition-colors"
                    >
                      <XCircle size={13} /> Decline
                    </button>
                    <button
                      onClick={() => resolveRequest(r.id || i, "approved")}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-confirmed text-white hover:opacity-90 transition-opacity shadow-xs"
                    >
                      <CheckCircle2 size={13} /> Approve Transfer
                    </button>
                  </div>
                ) : (
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      r.status === "approved" ? "bg-confirmed/15 text-confirmed" : "bg-rejected/15 text-rejected"
                    }`}
                  >
                    {r.status}
                  </span>
                )}
              </div>
            ))}
            {requests.length === 0 && <p className="text-sm text-muted">No requests on file.</p>}
          </div>
        </div>
      )}

      {/* 10. PAYMENTS OVERVIEW */}
      {active === "payments" && (
        <div>
          <h2 className="font-display text-xl text-ink mb-1">Fee payments overview</h2>
          <p className="text-sm text-muted mb-6">
            Track student fee collection status. Click any status to toggle between Paid, Pending, and Unpaid.
          </p>
          <div className="bg-white border border-line rounded overflow-x-auto max-w-3xl shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-paper text-xs uppercase tracking-wide text-muted text-left border-b border-line">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">College ID</th>
                  <th className="px-5 py-3 font-medium">Block & Room</th>
                  <th className="px-5 py-3 font-medium">Fee Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.collegeId} className="border-t border-line hover:bg-paper/30 transition-colors">
                    <td className="px-5 py-3 text-slate font-medium">{s.name}</td>
                    <td className="px-5 py-3 font-mono text-muted">{s.collegeId}</td>
                    <td className="px-5 py-3 text-slate">{s.block} · {s.room}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => cycleFeeStatus(s.collegeId)}
                        title="Click to update status"
                        className={`text-xs font-medium capitalize px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity ${FEE_STYLES[s.feeStatus]}`}
                      >
                        {s.feeStatus}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Outpass QR Modal */}
      <OutpassModal
        isOpen={Boolean(activeQrOutpass)}
        onClose={() => setActiveQrOutpass(null)}
        outpass={activeQrOutpass}
      />

      {/* Add Hostel Block Modal */}
      {showAddBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkdeep/70 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-line shadow-xl max-w-md w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Building size={18} className="text-brass" />
                <h3 className="font-display text-lg text-ink font-semibold">Add Hostel Block</h3>
              </div>
              <button onClick={() => setShowAddBlockModal(false)} className="text-muted hover:text-slate">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateBlock} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
                  Block Name
                </label>
                <input
                  value={newBlockName}
                  onChange={(e) => setNewBlockName(e.target.value)}
                  placeholder="e.g. Block D (PG Wing)"
                  className="w-full border border-line rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1">
                  Total Rooms
                </label>
                <input
                  type="number"
                  value={newBlockRooms}
                  onChange={(e) => setNewBlockRooms(e.target.value)}
                  className="w-full border border-line rounded px-3 py-2 text-sm font-mono"
                  min="1"
                  max="100"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBlockModal(false)}
                  className="flex-1 border border-line rounded py-2 text-sm text-muted hover:text-slate"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-ink text-white py-2 rounded text-sm font-medium hover:bg-inkdeep transition-colors"
                >
                  Create Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flag Maintenance Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkdeep/70 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-line shadow-xl max-w-md w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Wrench size={18} className="text-pending" />
                <h3 className="font-display text-lg text-ink font-semibold">Room Maintenance Toggle</h3>
              </div>
              <button onClick={() => setShowMaintenanceModal(false)} className="text-muted hover:text-slate">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-medium text-muted uppercase tracking-wide block">
                Select Room to Flag / Unflag
              </label>
              <select
                value={maintenanceRoom}
                onChange={(e) => setMaintenanceRoom(e.target.value)}
                className="w-full border border-line rounded px-3 py-2 text-sm bg-white font-mono"
              >
                <option value="">Select a room…</option>
                {rooms.map((r) => (
                  <option key={r.room} value={r.room}>
                    {r.room} ({r.block}) — {r.maintenance ? "Currently under maintenance" : "Normal"}
                  </option>
                ))}
              </select>

              {maintenanceRoom && (
                <div className="pt-2">
                  {rooms.find((r) => r.room === maintenanceRoom)?.maintenance ? (
                    <button
                      onClick={() => {
                        handleToggleMaintenance(maintenanceRoom, true);
                        setShowMaintenanceModal(false);
                      }}
                      className="w-full bg-confirmed text-white py-2 rounded text-sm font-medium hover:opacity-90"
                    >
                      Clear Maintenance Status
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleToggleMaintenance(maintenanceRoom, false);
                        setShowMaintenanceModal(false);
                      }}
                      className="w-full bg-rejected text-white py-2 rounded text-sm font-medium hover:opacity-90"
                    >
                      Flag Under Maintenance
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
