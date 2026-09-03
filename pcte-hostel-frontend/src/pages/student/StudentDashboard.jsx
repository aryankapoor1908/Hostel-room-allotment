import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import RoomKeyTag from "../../components/RoomKeyTag";
import SectionTabs from "../../components/SectionTabs";
import AdmissionsInfoContent from "../../components/AdmissionsInfoContent";
import PaymentModal from "../../components/PaymentModal";
import AllotmentLetterModal from "../../components/AllotmentLetterModal";
import RoomChangeModal from "../../components/RoomChangeModal";
import FloorMap from "../../components/FloorMap";
import OutpassModal from "../../components/OutpassModal";
import CheckinInventoryModal from "../../components/CheckinInventoryModal";
import ComplaintModal from "../../components/ComplaintModal";
import { ROOM_TYPES } from "../../constants/roomTypes";
import { useAuth } from "../../context/AuthContext";
import { useHostelData } from "../../context/HostelDataContext";
import { HOW_TO_APPLY, REQUIRED_DOCUMENTS } from "../../components/facilitiesContent";
import {
  CreditCard,
  FileText,
  Info,
  IndianRupee,
  FileCheck,
  GraduationCap,
  Landmark,
  BedDouble,
  CheckCircle2,
  ClipboardList,
  ArrowRightLeft,
  Clock,
  Download,
  QrCode,
  UtensilsCrossed,
  Bell,
  ShoppingBag,
  Plus,
  Send,
  Star,
  ClipboardCheck,
} from "lucide-react";

const NAV = [
  { key: "overview", label: "My Allotment" },
  { key: "floormap", label: "Floor Plan" },
  { key: "outpass", label: "Digital Outpass" },
  { key: "complaints", label: "Maintenance" },
  { key: "mess", label: "Mess & Dining" },
  { key: "notices", label: "Notices & Community" },
  { key: "preferences", label: "Preferences" },
  { key: "fees", label: "Room Types & Fees" },
  { key: "payment", label: "Fee Payment" },
];

const INFO_TABS = [
  { key: "overview", label: "Overview", icon: Info },
  { key: "fees", label: "Course Fees & Eligibility", icon: IndianRupee },
  { key: "how-to-apply", label: "How to Apply", icon: FileCheck },
  { key: "scholarship", label: "Scholarship", icon: GraduationCap },
  { key: "loan", label: "Education Loan", icon: Landmark },
  { key: "pay", label: "Pay Your Fees", icon: CreditCard },
  { key: "facilities", label: "Hostel Facilities", icon: BedDouble },
];

const ROOM_TYPE_KEY_MAP = {
  single: "1-seater",
  double: "2-seater",
  triple: "3-seater",
};

const ROOM_TYPE_LABEL = {
  single: "Single",
  double: "Double sharing",
  triple: "Triple sharing",
};

export default function StudentDashboard() {
  const [active, setActive] = useState("overview");
  const [infoTab, setInfoTab] = useState("facilities");

  // Modals state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [activeQrOutpass, setActiveQrOutpass] = useState(null);

  // New Outpass Form
  const [outpassType, setOutpassType] = useState("Day Outing");
  const [outpassDestination, setOutpassDestination] = useState("");
  const [outpassPurpose, setOutpassPurpose] = useState("");
  const [outpassReturn, setOutpassReturn] = useState("Today, 8:00 PM");
  const [outpassParent, setOutpassParent] = useState("+91 98765-12345");
  const [outpassSuccess, setOutpassSuccess] = useState(false);

  // Mess View
  const [selectedDay, setSelectedDay] = useState("Thursday");
  const [mealRating, setMealRating] = useState(5);
  const [mealFeedback, setMealFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Marketplace item form
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [itemTitle, setItemTitle] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("Appliances");
  const [itemCondition, setItemCondition] = useState("");

  const { user } = useAuth();
  const {
    students,
    rooms,
    requests,
    outpasses,
    complaints,
    notices,
    messMenu,
    mealSkips,
    marketplace,
    inventoryChecklist,
    studentPreferences,
    applyOutpass,
    submitComplaint,
    toggleMealSkip,
    addMarketplaceItem,
    verifyInventoryItem,
    submitPreferences,
    payFee,
    requestRoomChange,
  } = useHostelData();

  // Current logged in student
  const currentStudent = students.find(
    (s) => s.collegeId?.toLowerCase() === user?.collegeId?.toLowerCase()
  ) || {
    name: user?.name || "Aryan Kapoor",
    collegeId: user?.collegeId || "BCA0140",
    block: "Block B",
    room: "B-214",
    roomType: "Double",
    feeStatus: "unpaid",
    status: "allotted",
  };

  const savedPref = studentPreferences[user?.collegeId] || {
    hostelBlock: currentStudent.block || "Block B",
    roomType: currentStudent.roomType?.toLowerCase().includes("single")
      ? "single"
      : currentStudent.roomType?.toLowerCase().includes("triple")
      ? "triple"
      : "double",
    roommate: "",
    submitted: true,
  };

  const [form, setForm] = useState({
    hostelBlock: savedPref.hostelBlock,
    roomType: savedPref.roomType,
    roommate: savedPref.roommate || "",
  });
  const [submitted, setSubmitted] = useState(Boolean(savedPref.submitted));

  // Student specific records
  const studentOutpasses = outpasses.filter(
    (o) => o.collegeId?.toLowerCase() === user?.collegeId?.toLowerCase() || o.student === currentStudent.name
  );

  const studentComplaints = complaints.filter(
    (c) => c.collegeId?.toLowerCase() === user?.collegeId?.toLowerCase() || c.student === currentStudent.name
  );

  const studentRequest = requests.find(
    (r) =>
      r.collegeId?.toLowerCase() === user?.collegeId?.toLowerCase() ||
      r.student?.toLowerCase() === user?.name?.toLowerCase()
  );

  const studentSkips = mealSkips[user?.collegeId] || [];

  function handleFormChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmitPreferences(e) {
    e.preventDefault();
    submitPreferences(user.collegeId, form);
    setSubmitted(true);
  }

  function handlePaymentSuccess(details) {
    return payFee(user.collegeId, details);
  }

  function handleRoomChangeSubmit(payload) {
    requestRoomChange(payload);
  }

  function handleCreateOutpass(e) {
    e.preventDefault();
    if (!outpassDestination || !outpassPurpose) return;

    applyOutpass({
      student: currentStudent.name,
      collegeId: currentStudent.collegeId,
      room: currentStudent.room,
      block: currentStudent.block,
      type: outpassType,
      purpose: outpassPurpose,
      destination: outpassDestination,
      departureTime: outpassType === "Day Outing" ? "Today, 4:30 PM" : "Tomorrow, 6:00 PM",
      expectedReturn: outpassReturn,
      parentContact: outpassParent,
    });

    setOutpassDestination("");
    setOutpassPurpose("");
    setOutpassSuccess(true);
    setTimeout(() => setOutpassSuccess(false), 4000);
  }

  function handleCreateComplaint(payload) {
    submitComplaint(payload);
  }

  function handleCreateItem(e) {
    e.preventDefault();
    if (!itemTitle.trim() || !itemPrice.trim()) return;

    addMarketplaceItem({
      title: itemTitle.trim(),
      price: itemPrice.trim(),
      seller: currentStudent.name,
      room: currentStudent.room,
      phone: currentStudent.phone || "98765-43210",
      category: itemCategory,
      condition: itemCondition || "Well maintained",
    });

    setItemTitle("");
    setItemPrice("");
    setItemCondition("");
    setShowNewItemForm(false);
  }

  const selectedFee = ROOM_TYPES.find((r) => r.key === ROOM_TYPE_KEY_MAP[form.roomType]);

  return (
    <DashboardShell navItems={NAV} activeKey={active} onNavigate={setActive}>
      {/* 1. MY ALLOTMENT OVERVIEW */}
      {active === "overview" && (
        <div className="space-y-6">
          {studentRequest && (
            <div
              className={`border rounded p-4 flex items-center justify-between text-sm ${
                studentRequest.status === "approved"
                  ? "bg-confirmed/10 border-confirmed/30 text-confirmed"
                  : studentRequest.status === "declined"
                  ? "bg-rejected/10 border-rejected/30 text-rejected"
                  : "bg-pending/10 border-pending/30 text-pending"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {studentRequest.status === "pending" ? (
                  <Clock size={18} className="shrink-0" />
                ) : (
                  <CheckCircle2 size={18} className="shrink-0" />
                )}
                <div>
                  <p className="font-semibold">
                    Room change request: {studentRequest.from} → {studentRequest.to} ({studentRequest.status})
                  </p>
                  <p className="text-xs opacity-80 mt-0.5">Reason: {studentRequest.reason}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                {studentRequest.status}
              </span>
            </div>
          )}

          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl text-ink mb-1">Allotment status</h2>
                <p className="text-sm text-muted mb-4 max-w-md">
                  Official hostel residence record for Academic Session 2026–27.
                </p>
                <div className="bg-white border border-line rounded p-5 space-y-3 max-w-md shadow-xs">
                  <Row label="Registration ID" value={currentStudent.collegeId} />
                  <Row label="Hostel Block" value={currentStudent.block} />
                  <Row label="Room Number" value={currentStudent.room} isMono />
                  <Row
                    label="Room Type"
                    value={
                      currentStudent.roomType.includes("sharing")
                        ? currentStudent.roomType
                        : `${currentStudent.roomType} sharing`
                    }
                  />
                  <div className="flex items-center justify-between text-sm pt-1 border-t border-line">
                    <span className="text-muted">Fee Confirmation</span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        currentStudent.feeStatus === "paid"
                          ? "bg-confirmed/10 text-confirmed"
                          : currentStudent.feeStatus === "pending"
                          ? "bg-pending/10 text-pending"
                          : "bg-rejected/10 text-rejected"
                      }`}
                    >
                      {currentStudent.feeStatus === "paid" ? "Paid / Confirmed" : currentStudent.feeStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-md">
                <button
                  onClick={() => setShowLetterModal(true)}
                  className="flex items-center justify-center gap-1.5 bg-ink text-white px-3 py-2.5 rounded text-xs font-medium hover:bg-inkdeep transition-colors shadow-xs"
                >
                  <FileText size={14} /> Allotment Slip
                </button>

                <button
                  onClick={() => setShowInventoryModal(true)}
                  className="flex items-center justify-center gap-1.5 border border-line bg-white text-slate px-3 py-2.5 rounded text-xs font-medium hover:bg-paper transition-colors shadow-xs"
                >
                  <ClipboardCheck size={14} className="text-brass" /> Room Fixtures
                </button>

                <button
                  onClick={() => setShowChangeModal(true)}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 border border-line bg-white text-slate px-3 py-2.5 rounded text-xs font-medium hover:bg-paper transition-colors shadow-xs"
                >
                  <ArrowRightLeft size={14} className="text-brass" /> Request Change
                </button>
              </div>

              {currentStudent.feeStatus !== "paid" && (
                <div className="bg-brass/10 border border-brass/30 rounded p-4 max-w-md flex items-start gap-3">
                  <CreditCard size={18} className="text-brass mt-0.5 shrink-0" />
                  <div className="text-xs text-slate">
                    <p className="font-semibold text-ink">Hostel 1st Installment Due</p>
                    <p className="mt-0.5 text-muted">
                      Your room is provisionally reserved. Clear your 1st installment to finalize check-in.
                    </p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="mt-2 text-xs font-semibold text-brass hover:underline inline-flex items-center gap-1"
                    >
                      Pay ₹60,000 online now →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <RoomKeyTag
                status={currentStudent.status || "allotted"}
                hostelBlock={currentStudent.block}
                roomNumber={currentStudent.room}
                roomType={
                  currentStudent.roomType.includes("sharing")
                    ? currentStudent.roomType
                    : `${currentStudent.roomType} sharing`
                }
                studentName={currentStudent.name}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. INTERACTIVE FLOOR PLAN */}
      {active === "floormap" && (
        <div className="space-y-4">
          <div>
            <h2 className="font-display text-xl text-ink">Hostel Floor Plan</h2>
            <p className="text-sm text-muted">
              Explore your residence block, check room statuses, and locate nearby water coolers, stairs, and washroom blocks.
            </p>
          </div>
          <FloorMap
            rooms={rooms}
            highlightRoomNumber={currentStudent.room}
            selectedBlock={currentStudent.block || "Block B"}
          />
        </div>
      )}

      {/* 3. DIGITAL OUTPASS */}
      {active === "outpass" && (
        <div className="space-y-6 max-w-3xl">
          <div>
            <h2 className="font-display text-xl text-ink">Digital Hostel Gate Pass</h2>
            <p className="text-sm text-muted">
              Mandatory digital pass for leaving campus premises. Gates close strictly at 8:30 PM.
            </p>
          </div>

          {outpassSuccess && (
            <div className="flex items-center gap-3 bg-confirmed/10 border border-confirmed/30 text-confirmed rounded p-4 text-sm">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>Outpass application submitted to the Warden for approval!</span>
            </div>
          )}

          {/* New Outpass Application Form */}
          <form onSubmit={handleCreateOutpass} className="bg-white border border-line rounded p-5 space-y-4 shadow-xs">
            <h3 className="font-display text-base text-ink font-semibold flex items-center gap-2">
              <Send size={16} className="text-brass" /> Apply for Gate Exit
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Pass Category">
                <select
                  value={outpassType}
                  onChange={(e) => setOutpassType(e.target.value)}
                  className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
                >
                  <option value="Day Outing">Day Outing (Return by 8:00 PM)</option>
                  <option value="Night Out / Home Leave">Night Out / Home Leave (Overnight)</option>
                </select>
              </Field>

              <Field label="Expected Return Window">
                <input
                  value={outpassReturn}
                  onChange={(e) => setOutpassReturn(e.target.value)}
                  placeholder="e.g. Today, 8:00 PM"
                  className="w-full border border-line rounded px-3 py-2 text-sm"
                  required
                />
              </Field>

              <Field label="Destination Address">
                <input
                  value={outpassDestination}
                  onChange={(e) => setOutpassDestination(e.target.value)}
                  placeholder="e.g. Sarabha Nagar / Home in Jalandhar"
                  className="w-full border border-line rounded px-3 py-2 text-sm"
                  required
                />
              </Field>

              <Field label="Parent / Emergency Contact">
                <input
                  value={outpassParent}
                  onChange={(e) => setOutpassParent(e.target.value)}
                  placeholder="+91 98765-XXXXX"
                  className="w-full border border-line rounded px-3 py-2 text-sm font-mono"
                  required
                />
              </Field>
            </div>

            <Field label="Purpose / Reason">
              <input
                value={outpassPurpose}
                onChange={(e) => setOutpassPurpose(e.target.value)}
                placeholder="e.g. Buying course books, doctor appointment, family function…"
                className="w-full border border-line rounded px-3 py-2 text-sm"
                required
              />
            </Field>

            <button
              type="submit"
              className="bg-brass text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-brassLight transition-colors shadow-xs"
            >
              Submit Outpass Request
            </button>
          </form>

          {/* Outpass History / Status Cards */}
          <div className="space-y-3">
            <h3 className="font-display text-base text-ink font-semibold">Your Gate Pass Requests</h3>
            {studentOutpasses.map((o) => (
              <div key={o.id} className="bg-white border border-line rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink">{o.type}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                        o.status === "approved"
                          ? "bg-confirmed/15 text-confirmed"
                          : o.status === "pending"
                          ? "bg-pending/15 text-pending"
                          : "bg-rejected/15 text-rejected"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate mt-1 font-medium">{o.destination} · {o.purpose}</p>
                  <p className="text-[11px] text-muted mt-0.5 font-mono">
                    Departure: {o.departureTime} | Return by: {o.expectedReturn}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => setActiveQrOutpass(o)}
                    className="flex items-center gap-1.5 text-xs bg-ink text-white px-3 py-2 rounded hover:bg-inkdeep transition-colors shadow-2xs"
                  >
                    <QrCode size={14} /> View QR Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MAINTENANCE & COMPLAINTS HELPDESK */}
      {active === "complaints" && (
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-ink">Maintenance Helpdesk</h2>
              <p className="text-sm text-muted">
                Report electrical, plumbing, Wi-Fi, or furniture issues in your room.
              </p>
            </div>
            <button
              onClick={() => setShowComplaintModal(true)}
              className="flex items-center gap-2 text-sm bg-brass text-white px-4 py-2 rounded hover:bg-brassLight transition-colors shadow-xs"
            >
              <Plus size={15} /> Raise Issue
            </button>
          </div>

          <div className="space-y-4">
            {studentComplaints.map((c) => (
              <div key={c.id} className="bg-white border border-line rounded p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-muted uppercase tracking-wider">{c.category} · Ticket #{c.id}</span>
                    <h4 className="font-display text-base text-ink font-semibold mt-0.5">{c.title}</h4>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded font-semibold capitalize w-fit ${
                      c.status === "resolved"
                        ? "bg-confirmed/15 text-confirmed"
                        : c.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-pending/15 text-pending"
                    }`}
                  >
                    {c.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-slate leading-relaxed">{c.description}</p>

                {/* Progress Tracking Bar */}
                <div className="pt-2 border-t border-line">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted mb-1.5">
                    <span className={c.status ? "text-confirmed font-bold" : ""}>1. Reported</span>
                    <span className={c.status !== "reported" ? "text-confirmed font-bold" : ""}>2. Assigned ({c.technician})</span>
                    <span className={c.status === "resolved" ? "text-confirmed font-bold" : ""}>3. Resolved</span>
                  </div>
                  <div className="h-1.5 bg-paper rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brass transition-all duration-500"
                      style={{
                        width: c.status === "resolved" ? "100%" : c.status === "in_progress" ? "65%" : "35%",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {studentComplaints.length === 0 && (
              <div className="p-8 text-center bg-white border border-line rounded text-muted text-sm">
                No active complaints. Room fittings in good order!
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. MESS MENU & DINING */}
      {active === "mess" && (
        <div className="space-y-6 max-w-3xl">
          <div>
            <h2 className="font-display text-xl text-ink">Hostel Mess & Dining</h2>
            <p className="text-sm text-muted">
              4 daily meals included in hostel fee. Help prevent food waste by toggling meals you plan to skip.
            </p>
          </div>

          {/* Today's Chef Special */}
          <div className="bg-ink text-white rounded-lg p-5 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs font-mono uppercase text-brassLight tracking-wider flex items-center gap-1.5">
                <UtensilsCrossed size={14} /> Chef's Today's Special
              </span>
              <h3 className="font-display text-xl font-bold mt-1">Shahi Paneer & Hot Moong Dal Halwa</h3>
              <p className="text-xs text-white/70 mt-1">Served at Dinner (8:00 PM – 9:45 PM) in Mess Hall 1 & 2</p>
            </div>
            <div className="hidden sm:block text-right font-mono text-xs text-white/60">
              <span>Pure Ghee</span>
              <br />
              <span>Hygienic Prep</span>
            </div>
          </div>

          {/* Day Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white border border-line p-1.5 rounded-lg">
            {Object.keys(messMenu).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDay === day ? "bg-ink text-brassLight" : "text-muted hover:text-slate"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Meals for Selected Day */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { meal: "Breakfast", time: "7:30 AM – 9:30 AM", key: `${selectedDay.toLowerCase()}_breakfast`, desc: messMenu[selectedDay]?.breakfast },
              { meal: "Lunch", time: "12:30 PM – 2:00 PM", key: `${selectedDay.toLowerCase()}_lunch`, desc: messMenu[selectedDay]?.lunch },
              { meal: "Evening Snacks", time: "5:00 PM – 6:00 PM", key: `${selectedDay.toLowerCase()}_snacks`, desc: messMenu[selectedDay]?.snacks },
              { meal: "Dinner", time: "8:00 PM – 9:45 PM", key: `${selectedDay.toLowerCase()}_dinner`, desc: messMenu[selectedDay]?.dinner },
            ].map((m) => {
              const isSkipped = studentSkips.includes(m.key);
              return (
                <div
                  key={m.meal}
                  className={`border rounded p-4 space-y-2 transition-all ${
                    isSkipped ? "bg-slate/5 border-line opacity-60" : "bg-white border-line shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display text-sm font-bold text-ink">{m.meal}</span>
                      <p className="text-[11px] text-muted font-mono">{m.time}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleMealSkip(user.collegeId, m.key)}
                      className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                        isSkipped
                          ? "bg-rejected/10 text-rejected border border-rejected/30"
                          : "bg-paper text-slate hover:bg-slate/10"
                      }`}
                    >
                      {isSkipped ? "Skipped ✗" : "Dining In ✓"}
                    </button>
                  </div>
                  <p className="text-xs text-slate leading-relaxed">{m.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Feedback Form */}
          <div className="bg-white border border-line rounded p-5 space-y-3 shadow-xs">
            <h4 className="font-display text-sm font-semibold text-ink">Rate Today's Mess Food & Service</h4>
            {feedbackSent ? (
              <p className="text-xs text-confirmed flex items-center gap-1 font-medium">
                <CheckCircle2 size={14} /> Thank you! Your feedback has been passed to the Mess Committee.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setMealRating(star)}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star size={18} fill={star <= mealRating ? "currentColor" : "none"} />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-muted ml-2">{mealRating} / 5 Stars</span>
                </div>
                <textarea
                  value={mealFeedback}
                  onChange={(e) => setMealFeedback(e.target.value)}
                  placeholder="Suggestions on taste, hygiene, or timing…"
                  rows={2}
                  className="w-full border border-line rounded px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackSent(true);
                    setMealFeedback("");
                  }}
                  className="bg-ink text-white px-3.5 py-1.5 rounded text-xs font-medium hover:bg-inkdeep"
                >
                  Send Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. NOTICES & COMMUNITY */}
      {active === "notices" && (
        <div className="space-y-8 max-w-3xl">
          {/* Official Notices */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-brass" />
              <h2 className="font-display text-xl text-ink font-semibold">Official Hostel Circulars</h2>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="bg-white border border-line rounded p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        n.category === "Urgent"
                          ? "bg-rejected/15 text-rejected"
                          : n.category === "Event"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-paper text-slate"
                      }`}
                    >
                      {n.category}
                    </span>
                    <span className="text-xs font-mono text-muted">{n.date} · {n.author}</span>
                  </div>
                  <h4 className="font-display text-base text-ink font-semibold">{n.title}</h4>
                  <p className="text-xs text-slate leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Student Marketplace */}
          <div className="space-y-4 pt-4 border-t border-line">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-brass" />
                <h2 className="font-display text-xl text-ink font-semibold">Student Bazaar & Lost/Found</h2>
              </div>
              <button
                onClick={() => setShowNewItemForm((v) => !v)}
                className="flex items-center gap-1.5 text-xs bg-ink text-white px-3 py-1.5 rounded hover:bg-inkdeep shadow-xs"
              >
                <Plus size={14} /> Post Listing
              </button>
            </div>

            {showNewItemForm && (
              <form onSubmit={handleCreateItem} className="bg-paper border border-line rounded p-4 space-y-3">
                <h4 className="font-display text-sm font-semibold text-ink">New Listing</h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    placeholder="Item title (e.g. Study Table Lamp)"
                    className="sm:col-span-2 border border-line bg-white rounded px-3 py-1.5 text-xs"
                    required
                  />
                  <input
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="Price (e.g. ₹400 / Free)"
                    className="border border-line bg-white rounded px-3 py-1.5 text-xs font-mono"
                    required
                  />
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="border border-line bg-white rounded px-3 py-1.5 text-xs"
                  >
                    <option value="Appliances">Appliances</option>
                    <option value="Books">Books & Notes</option>
                    <option value="Lost & Found">Lost & Found</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    value={itemCondition}
                    onChange={(e) => setItemCondition(e.target.value)}
                    placeholder="Condition notes…"
                    className="sm:col-span-2 border border-line bg-white rounded px-3 py-1.5 text-xs"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowNewItemForm(false)}
                    className="text-xs text-muted px-3 py-1 hover:text-slate"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-brass text-white text-xs font-semibold px-4 py-1.5 rounded hover:bg-brassLight"
                  >
                    Publish Listing
                  </button>
                </div>
              </form>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {marketplace.map((m) => (
                <div key={m.id} className="bg-white border border-line rounded p-4 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper text-slate font-medium">
                      {m.category}
                    </span>
                    <span className="font-mono font-bold text-sm text-ink">{m.price}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-ink">{m.title}</h4>
                  <p className="text-xs text-muted">{m.condition}</p>
                  <div className="text-[11px] font-mono text-slate border-t border-line/60 pt-2 flex justify-between">
                    <span>{m.seller} ({m.room})</span>
                    <span className="text-brass font-semibold">📞 {m.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. PREFERENCES */}
      {active === "preferences" && (
        <div className="max-w-2xl">
          <h2 className="font-display text-xl text-ink mb-1">Room preferences</h2>
          <p className="text-sm text-muted mb-6">
            Preferences submitted before the session deadline are matched first-come, first-served.
          </p>

          {!submitted && (
            <form onSubmit={handleSubmitPreferences} className="bg-white border border-line rounded p-5 space-y-4 max-w-md shadow-xs">
              <Field label="Hostel block">
                <select
                  value={form.hostelBlock}
                  onChange={(e) => handleFormChange("hostelBlock", e.target.value)}
                  className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
                >
                  <option>Block A</option>
                  <option>Block B</option>
                  <option>Block C</option>
                </select>
              </Field>
              <Field label="Room type">
                <select
                  value={form.roomType}
                  onChange={(e) => handleFormChange("roomType", e.target.value)}
                  className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
                >
                  <option value="single">Single</option>
                  <option value="double">Double sharing</option>
                  <option value="triple">Triple sharing</option>
                </select>
              </Field>
              <Field label="Roommate preference (optional)">
                <input
                  value={form.roommate}
                  onChange={(e) => handleFormChange("roommate", e.target.value)}
                  placeholder="College ID of preferred roommate"
                  className="w-full border border-line rounded px-3 py-2 text-sm font-mono"
                />
              </Field>
              <button
                type="submit"
                className="w-full bg-ink text-white py-2.5 rounded text-sm font-medium hover:bg-inkdeep transition-colors"
              >
                Save preferences
              </button>
            </form>
          )}

          {submitted && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 bg-confirmed/10 border border-confirmed/30 rounded p-4">
                <CheckCircle2 size={18} className="text-confirmed mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-ink">Preference saved & recorded</p>
                  <p className="text-sm text-muted mt-0.5">
                    {form.hostelBlock} · {ROOM_TYPE_LABEL[form.roomType] || form.roomType}
                    {selectedFee ? ` (${selectedFee.label})` : ""}.
                    {form.roommate && ` Roommate requested: ${form.roommate}.`}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-medium text-brass hover:underline mt-2 inline-block"
                  >
                    Edit preferences
                  </button>
                </div>
              </div>

              {/* Allotment procedure */}
              <div className="bg-white border border-line rounded p-5 shadow-xs">
                <p className="font-display text-lg text-ink mb-4 flex items-center gap-2">
                  <ClipboardList size={18} className="text-brass" /> What happens next
                </p>
                <ol className="space-y-4">
                  {HOW_TO_APPLY.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-ink text-brassLight text-xs font-mono font-semibold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">{step.title}</p>
                        <p className="text-sm text-muted mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Required documents */}
              <div className="bg-white border border-line rounded p-5 shadow-xs">
                <p className="font-display text-lg text-ink mb-1 flex items-center gap-2">
                  <FileText size={18} className="text-brass" /> Documents required at check-in
                </p>
                <p className="text-sm text-muted">Carry these when you report to the block warden.</p>
                <ul className="mt-4 space-y-2.5">
                  {REQUIRED_DOCUMENTS.map((doc) => (
                    <li key={doc} className="flex items-start gap-2.5 text-sm text-slate">
                      <CheckCircle2 size={16} className="text-brass mt-0.5 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. ROOM TYPES & FEES */}
      {active === "fees" && (
        <div className="space-y-6">
          <SectionTabs
            flagLabel="Admissions Info"
            tabs={INFO_TABS}
            activeKey={infoTab}
            onChange={setInfoTab}
          />
          <div>
            <h2 className="font-display text-xl text-ink mb-1">Hostel Facilities & Fee Structure</h2>
            <p className="text-sm text-muted mb-6 max-w-lg">
              Official rates include meals (breakfast, lunch, evening tea & dinner). Select any tab above to explore full admissions details.
            </p>
            <AdmissionsInfoContent activeTab={infoTab} />
          </div>
        </div>
      )}

      {/* 9. FEE PAYMENT */}
      {active === "payment" && (
        <div className="max-w-md">
          <h2 className="font-display text-xl text-ink mb-1">Hostel Fee Payment</h2>
          <p className="text-sm text-muted mb-6">
            Billed per academic year in two installments. Food and accommodation included.
          </p>

          <div className="bg-white border border-line rounded p-5 shadow-xs space-y-4">
            {currentStudent.feeStatus === "paid" ? (
              <div className="bg-confirmed/10 border border-confirmed/30 rounded p-4 text-center space-y-2">
                <CheckCircle2 size={28} className="text-confirmed mx-auto" />
                <p className="font-display text-base text-ink font-semibold">1st Installment Cleared</p>
                <p className="text-xs text-muted">
                  Your hostel seat in <span className="font-mono font-medium text-slate">{currentStudent.room}</span> is confirmed for Session 2026–27.
                </p>
              </div>
            ) : null}

            <div className="flex items-center justify-between pb-3">
              <span className="text-sm text-muted">Room type</span>
              <span className="text-sm font-medium text-ink">
                {selectedFee ? selectedFee.label : "2 Seater (Double sharing)"}
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <span className="text-sm text-muted">Session 2026–27 Total Fee</span>
              <span className="font-mono text-lg font-bold text-ink">
                {selectedFee?.fee?.fan || "₹95,000"}
              </span>
            </div>

            <Row label="1st Installment (Due Now)" value={selectedFee?.installment1?.fan || "₹50,000"} isMono />
            <Row label="2nd Installment (Mid-session)" value={selectedFee?.installment2?.fan || "₹45,000"} isMono />

            {currentStudent.feeStatus === "paid" ? (
              <button
                onClick={() => setShowLetterModal(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-ink text-white py-2.5 rounded text-sm font-medium hover:bg-inkdeep transition-colors"
              >
                <Download size={16} /> View Allotment Slip / Receipt
              </button>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-brass text-white py-2.5 rounded text-sm font-medium hover:bg-brassLight transition-colors"
              >
                <CreditCard size={16} /> Pay 1st Installment Online
              </button>
            )}

            <button
              onClick={() => setShowLetterModal(true)}
              className="w-full flex items-center justify-center gap-2 border border-line py-2.5 rounded text-sm text-slate hover:bg-paper transition-colors"
            >
              <FileText size={16} /> Download Allotment Order
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        student={currentStudent}
        roomTypeFee={selectedFee}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AllotmentLetterModal
        isOpen={showLetterModal}
        onClose={() => setShowLetterModal(false)}
        student={currentStudent}
        allotment={{
          hostelBlock: currentStudent.block,
          roomNumber: currentStudent.room,
          roomType: currentStudent.roomType,
        }}
      />

      <RoomChangeModal
        isOpen={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        student={currentStudent}
        currentRoom={currentStudent.room}
        availableRooms={rooms}
        onSubmit={handleRoomChangeSubmit}
      />

      <OutpassModal
        isOpen={Boolean(activeQrOutpass)}
        onClose={() => setActiveQrOutpass(null)}
        outpass={activeQrOutpass}
      />

      <CheckinInventoryModal
        isOpen={showInventoryModal}
        onClose={() => setShowInventoryModal(false)}
        student={currentStudent}
        items={inventoryChecklist}
        onToggleVerify={verifyInventoryItem}
      />

      <ComplaintModal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        student={currentStudent}
        onSubmit={handleCreateComplaint}
      />
    </DashboardShell>
  );
}

function Row({ label, value, isMono }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className={`text-slate ${isMono ? "font-mono font-semibold" : "font-medium"}`}>{value}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted uppercase tracking-wide">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
