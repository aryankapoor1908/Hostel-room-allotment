import { createContext, useContext, useState, useEffect } from "react";

const HostelDataContext = createContext(null);

const STORAGE_KEY = "pcte_hostel_data_v3";

const INITIAL_HOSTELS = [
  { name: "Block A", rooms: 24, occupied: 19 },
  { name: "Block B", rooms: 30, occupied: 27 },
  { name: "Block C", rooms: 18, occupied: 11 },
];

const INITIAL_ROOMS = [
  { room: "B-101", block: "Block B", floor: 1, type: "Single", capacity: 1, occupied: 1, students: ["Kabir Mehta"], maintenance: false },
  { room: "B-102", block: "Block B", floor: 1, type: "Double", capacity: 2, occupied: 2, students: ["Jatin Gill", "Harshdeep Singh"], maintenance: false },
  { room: "B-103", block: "Block B", floor: 1, type: "Double", capacity: 2, occupied: 1, students: ["Navjot Singh"], maintenance: false },
  { room: "B-104", block: "Block B", floor: 1, type: "Single", capacity: 1, occupied: 0, students: [], maintenance: true },
  { room: "B-201", block: "Block B", floor: 2, type: "Double", capacity: 2, occupied: 1, students: ["Simran Dhillon"], maintenance: false },
  { room: "B-202", block: "Block B", floor: 2, type: "Double", capacity: 2, occupied: 1, students: ["Anaya Mehta"], maintenance: false },
  { room: "B-203", block: "Block B", floor: 2, type: "Triple", capacity: 3, occupied: 3, students: ["Ishita Rao", "Kavya Nair", "Priya Sharma"], maintenance: false },
  { room: "B-204", block: "Block B", floor: 2, type: "Single", capacity: 1, occupied: 0, students: [], maintenance: false },
  { room: "B-214", block: "Block B", floor: 2, type: "Double", capacity: 2, occupied: 1, students: ["Aryan Kapoor"], maintenance: false },
  { room: "B-301", block: "Block B", floor: 3, type: "Double", capacity: 2, occupied: 2, students: ["Vikramaditya", "Samarjit Singh"], maintenance: false },
  { room: "B-302", block: "Block B", floor: 3, type: "Triple", capacity: 3, occupied: 2, students: ["Aman Chopra", "Gaurav Joshi"], maintenance: false },
  { room: "B-303", block: "Block B", floor: 3, type: "Single", capacity: 1, occupied: 0, students: [], maintenance: false },
  { room: "A-108", block: "Block A", floor: 1, type: "Double", capacity: 2, occupied: 0, students: [], maintenance: false },
  { room: "A-112", block: "Block A", floor: 1, type: "Single", capacity: 1, occupied: 1, students: ["Rohan Verma"], maintenance: false },
  { room: "C-045", block: "Block C", floor: 1, type: "Triple", capacity: 3, occupied: 1, students: ["Manpreet Kaur"], maintenance: false },
  { room: "C-046", block: "Block C", floor: 1, type: "Double", capacity: 2, occupied: 0, students: [], maintenance: false },
];

const INITIAL_STUDENTS = [
  { name: "Aryan Kapoor", collegeId: "BCA0140", block: "Block B", room: "B-214", roomType: "Double", feeStatus: "unpaid", status: "allotted", phone: "98765-43210" },
  { name: "Simran Dhillon", collegeId: "PCTE22CS042", block: "Block B", room: "B-201", roomType: "Double", feeStatus: "paid", status: "allotted", phone: "98140-54321" },
  { name: "Anaya Mehta", collegeId: "PCTE22CS019", block: "Block B", room: "B-202", roomType: "Double", feeStatus: "paid", status: "allotted", phone: "98720-11223" },
  { name: "Ishita Rao", collegeId: "PCTE22CS027", block: "Block B", room: "B-203", roomType: "Triple", feeStatus: "paid", status: "allotted", phone: "98888-22334" },
  { name: "Kavya Nair", collegeId: "PCTE22CS033", block: "Block B", room: "B-203", roomType: "Triple", feeStatus: "unpaid", status: "allotted", phone: "98150-33445" },
  { name: "Priya Sharma", collegeId: "PCTE22CS008", block: "Block B", room: "B-203", roomType: "Triple", feeStatus: "paid", status: "allotted", phone: "97810-44556" },
  { name: "Rohan Verma", collegeId: "PCTE22ME014", block: "Block A", room: "A-112", roomType: "Single", feeStatus: "paid", status: "allotted", phone: "99140-55667" },
  { name: "Manpreet Kaur", collegeId: "PCTE22BBA005", block: "Block C", room: "C-045", roomType: "Triple", feeStatus: "pending", status: "allotted", phone: "98780-66778" },
  { name: "Gurpreet Singh", collegeId: "PCTE23CS102", block: "Block A", room: "Unassigned", roomType: "Double", feeStatus: "paid", status: "pending", phone: "98144-77889" },
  { name: "Taranjeet Sandhu", collegeId: "PCTE23BCA088", block: "Block B", room: "Unassigned", roomType: "Single", feeStatus: "pending", status: "pending", phone: "98760-88990" },
];

const INITIAL_REQUESTS = [
  { id: "req_1", student: "Anaya Mehta", collegeId: "PCTE22CS019", from: "B-202", to: "B-201", reason: "Wants to room with sister", status: "pending" },
];

const INITIAL_OUTPASSES = [
  {
    id: "out_101",
    student: "Aryan Kapoor",
    collegeId: "BCA0140",
    room: "B-214",
    block: "Block B",
    type: "Day Outing",
    purpose: "City Market & Books Purchase",
    destination: "Sarabha Nagar Market, Ludhiana",
    departureTime: "Today, 4:00 PM",
    expectedReturn: "Today, 8:00 PM",
    parentContact: "+91 98765-12345",
    status: "approved",
    approvedBy: "Prof. S. Sharma (Warden)",
    createdAt: "2026-09-03T10:30:00Z",
  },
  {
    id: "out_102",
    student: "Simran Dhillon",
    collegeId: "PCTE22CS042",
    room: "B-201",
    block: "Block B",
    type: "Night Out / Home Leave",
    purpose: "Family function over weekend",
    destination: "Jalandhar City",
    departureTime: "Friday, 5:30 PM",
    expectedReturn: "Sunday, 7:30 PM",
    parentContact: "+91 98140-99887",
    status: "pending",
    approvedBy: null,
    createdAt: "2026-09-03T14:15:00Z",
  },
];

const INITIAL_COMPLAINTS = [
  {
    id: "cmp_301",
    student: "Aryan Kapoor",
    collegeId: "BCA0140",
    room: "B-214",
    block: "Block B",
    category: "Electrical",
    title: "Ceiling fan regulator noisy and slow",
    description: "Fan makes a rattling noise on speed 4 and 5. Needs bearing lubrication or regulator replacement.",
    priority: "Medium",
    status: "assigned",
    technician: "Ramesh Kumar (Electrician)",
    createdAt: "2026-09-02T11:00:00Z",
  },
  {
    id: "cmp_302",
    student: "Ishita Rao",
    collegeId: "PCTE22CS027",
    room: "B-203",
    block: "Block B",
    category: "Plumbing",
    title: "Attached washroom tap leaking",
    description: "Continuous slow drip from the washbasin tap.",
    priority: "Low",
    status: "resolved",
    technician: "Surjit Singh (Plumber)",
    createdAt: "2026-08-31T09:30:00Z",
  },
  {
    id: "cmp_303",
    student: "Rohan Verma",
    collegeId: "PCTE22ME014",
    room: "A-112",
    block: "Block A",
    category: "Wi-Fi / Internet",
    title: "Corridor Wi-Fi access point dropping connection",
    description: "Ping drops every 5 minutes in room A-112.",
    priority: "Urgent",
    status: "in_progress",
    technician: "Ankit (IT Network Cell)",
    createdAt: "2026-09-03T08:00:00Z",
  },
];

const INITIAL_NOTICES = [
  {
    id: "not_1",
    title: "Curfew & Biometric Attendance Reminder (8:30 PM Sharp)",
    body: "All residents of Boys and Girls Hostels are reminded that main gates close strictly at 8:30 PM. Night roll call is conducted at 9:00 PM. Failure to punch in or return without an approved gate pass will invite fine and parent notification.",
    category: "Urgent",
    date: "Sep 02, 2026",
    author: "Chief Hostel Warden",
  },
  {
    id: "not_2",
    title: "Annual Inter-Hostel Badminton & Table Tennis Tournament",
    body: "Registrations are now open for the Annual Hostel Sports Cup 2026. Matches will be held at the Campus Sports Complex on Saturday afternoon. Contact Block B Sports Secretary or the Warden Office to register.",
    category: "Event",
    date: "Sep 01, 2026",
    author: "Sports Committee",
  },
  {
    id: "not_3",
    title: "Solar Water Heater & Geyser Servicing Schedule",
    body: "Routine maintenance and descaling of solar water heaters for Block A, B & C will be carried out between 10:00 AM and 2:00 PM on Thursday. Hot water supply will resume by 4:00 PM.",
    category: "Maintenance",
    date: "Aug 29, 2026",
    author: "Estate Office",
  },
];

const INITIAL_MESS_MENU = {
  Monday: {
    breakfast: "Aloo Paratha with Butter, Curd, Pickle, Tea / Milk",
    lunch: "Dal Makhani, Seasonal Subzi, Jeera Rice, Tandoori Roti, Salad",
    snacks: "Veg Pakora, Green Chutney, Hot Masala Tea",
    dinner: "Paneer Butter Masala, Yellow Dal Tadka, Rice, Roti, Gulab Jamun",
  },
  Tuesday: {
    breakfast: "Poha with Roasted Peanuts, Boiled Eggs / Banana, Tea / Coffee",
    lunch: "Rajma Masala, Aloo Jeera, Steamed Basmati Rice, Phulka, Boondi Raita",
    snacks: "Samosa with Sweet Tamarind Dip, Tea",
    dinner: "Mix Veg Curry, Dal Fry, Jeera Rice, Butter Roti, Kheer",
  },
  Wednesday: {
    breakfast: "Stuffed Gobhi Paratha, White Butter, Mint Curd, Tea / Milk",
    lunch: "Kadhi Pakora, Aloo Methi, Steamed Rice, Roti, Papad, Salad",
    snacks: "Bread Roll with Tomato Ketchup, Tea",
    dinner: "Kadai Paneer, Black Chana Dal, Pulao, Tandoori Naan, Fruit Custard",
  },
  Thursday: {
    breakfast: "Idli Sambar with Coconut Chutney, Fresh Fruits, Tea / Coffee",
    lunch: "Chana Masala (Pindi Style), Bhature / Poori, Jeera Rice, Onion Salad",
    snacks: "Veg Cutlet, Masala Chai",
    dinner: "Dum Aloo Kashmiri, Moong Dal Tadka, Steam Rice, Chapati, Ice Cream",
  },
  Friday: {
    breakfast: "Paneer Stuffed Kulcha, Curd, Mango Pickle, Tea / Milk",
    lunch: "Kashmiri Rajma, Bhindi Do Pyaza, Steamed Rice, Phulka, Mix Raita",
    snacks: "Bun Maska / Pav, Cutting Chai",
    dinner: "Shahi Paneer, Dal Makhani, Peas Pulao, Laccha Paratha, Rasgulla",
  },
  Saturday: {
    breakfast: "Methi Paratha with Fresh Butter, Dahi, Boiled Egg / Fruit, Tea",
    lunch: "Kashmiri Pulao, Mixed Vegetable Korma, Yellow Dal, Chapati, Papad",
    snacks: "Maggi / Veg Sandwich, Lemon Iced Tea / Hot Tea",
    dinner: "Special Dal Tadka, Aloo Shimla Mirch, Jeera Rice, Roti, Moong Dal Halwa",
  },
  Sunday: {
    breakfast: "Chole Bhature with Pickled Onions, Fresh Buttermilk / Tea",
    lunch: "Veg Biryani with Mirchi Salan, Veg Raita, Boiled Corn, Sweet Paan",
    snacks: "Biscuits & Cookies, Special Ginger Cardamom Tea",
    dinner: "Chef's Special Thali: Mattar Paneer, Dal Bukhara, Naan, Rice, Jalebi",
  },
};

const INITIAL_MARKETPLACE = [
  {
    id: "mkt_1",
    title: "Crompton Personal Air Cooler (Used 1 Season)",
    price: "₹2,200",
    seller: "Karan Johar (Final Year BCA)",
    room: "B-304",
    phone: "98721-00998",
    category: "Appliances",
    condition: "Excellent condition, perfect for hot months",
  },
  {
    id: "mkt_2",
    title: "Electric Kettle (Prestige 1.5L Stainless Steel)",
    price: "₹650",
    seller: "Rahul Sharma",
    room: "A-208",
    phone: "98144-11223",
    category: "Appliances",
    condition: "Works perfectly for tea and noodles",
  },
  {
    id: "mkt_3",
    title: "BCA Semester 3 & 4 Standard Reference Textbooks (PTU)",
    price: "₹500 (Full set)",
    seller: "Aryan Kapoor",
    room: "B-214",
    phone: "98765-43210",
    category: "Books",
    condition: "Neat notes included inside",
  },
  {
    id: "mkt_4",
    title: "Lost: Fastrack Black Dial Smartwatch (Campus Gym)",
    price: "Reward: Treat!",
    seller: "Harpreet Singh",
    room: "B-108",
    phone: "99150-77665",
    category: "Lost & Found",
    condition: "Misplaced near treadmill on Tuesday evening",
  },
];

const INITIAL_INVENTORY_CHECKLIST = [
  { id: "inv_1", item: "Single/Double Bed with Headboard", condition: "Good", serial: "PCTE-FURN-214-A", verified: true },
  { id: "inv_2", item: "High-Density Foam Mattress", condition: "Clean & Intact", serial: "PCTE-MAT-894", verified: true },
  { id: "inv_3", item: "Study Desk with 2 Storage Drawers", condition: "Good", serial: "PCTE-DSK-214", verified: true },
  { id: "inv_4", item: "Ergonomic Study Chair", condition: "Good", serial: "PCTE-CHR-552", verified: true },
  { id: "inv_5", item: "Built-in Steel Wardrobe with Key", condition: "1 Key Issued", serial: "PCTE-WRD-214", verified: true },
  { id: "inv_6", item: "Usha Ceiling Fan & Regulator", condition: "Working (Reported for servicing)", serial: "PCTE-EL-104", verified: true },
  { id: "inv_7", item: "LED Tube Light Fixtures (x2)", condition: "Both Functional", serial: "PCTE-LGT-214", verified: true },
];

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load hostel data from localStorage:", e);
  }
  return {
    students: INITIAL_STUDENTS,
    rooms: INITIAL_ROOMS,
    hostels: INITIAL_HOSTELS,
    requests: INITIAL_REQUESTS,
    outpasses: INITIAL_OUTPASSES,
    complaints: INITIAL_COMPLAINTS,
    notices: INITIAL_NOTICES,
    messMenu: INITIAL_MESS_MENU,
    mealSkips: { BCA0140: [] },
    marketplace: INITIAL_MARKETPLACE,
    inventoryChecklist: INITIAL_INVENTORY_CHECKLIST,
    attendance: {
      "2026-09-03": {
        BCA0140: "present",
        PCTE22CS042: "present",
        PCTE22CS019: "present",
        PCTE22CS027: "present",
        PCTE22CS033: "present",
        PCTE22CS008: "present",
        PCTE22ME014: "present",
        PCTE22BBA005: "leave",
      },
    },
    receipts: [],
    studentPreferences: {
      BCA0140: { hostelBlock: "Block B", roomType: "double", roommate: "", submitted: true },
    },
  };
}

export function HostelDataProvider({ children }) {
  const [data, setData] = useState(loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist hostel data to localStorage:", e);
    }
  }, [data]);

  useEffect(() => {
    async function fetchBackendData() {
      try {
        const [
          hostelsRes,
          roomsRes,
          studentsRes,
          outpassesRes,
          complaintsRes,
          noticesRes,
          messMenuRes,
          marketplaceRes,
          inventoryRes,
          requestsRes,
          receiptsRes,
        ] = await Promise.allSettled([
          fetch("/api/hostels").then((r) => r.json()),
          fetch("/api/rooms").then((r) => r.json()),
          fetch("/api/students").then((r) => r.json()),
          fetch("/api/outpasses").then((r) => r.json()),
          fetch("/api/complaints").then((r) => r.json()),
          fetch("/api/notices").then((r) => r.json()),
          fetch("/api/mess/menu").then((r) => r.json()),
          fetch("/api/marketplace").then((r) => r.json()),
          fetch("/api/inventory").then((r) => r.json()),
          fetch("/api/students/requests/all").then((r) => r.json()),
          fetch("/api/students/receipts/all").then((r) => r.json()),
        ]);

        setData((prev) => {
          const updated = { ...prev };
          if (hostelsRes.status === "fulfilled" && hostelsRes.value?.data?.length) updated.hostels = hostelsRes.value.data;
          if (roomsRes.status === "fulfilled" && roomsRes.value?.data?.length) updated.rooms = roomsRes.value.data;
          if (studentsRes.status === "fulfilled" && studentsRes.value?.data?.length) updated.students = studentsRes.value.data;
          if (outpassesRes.status === "fulfilled" && outpassesRes.value?.data) updated.outpasses = outpassesRes.value.data;
          if (complaintsRes.status === "fulfilled" && complaintsRes.value?.data) updated.complaints = complaintsRes.value.data;
          if (noticesRes.status === "fulfilled" && noticesRes.value?.data) updated.notices = noticesRes.value.data;
          if (messMenuRes.status === "fulfilled" && messMenuRes.value?.data) updated.messMenu = messMenuRes.value.data;
          if (marketplaceRes.status === "fulfilled" && marketplaceRes.value?.data) updated.marketplace = marketplaceRes.value.data;
          if (inventoryRes.status === "fulfilled" && inventoryRes.value?.data) updated.inventoryChecklist = inventoryRes.value.data;
          if (requestsRes.status === "fulfilled" && requestsRes.value?.data) updated.requests = requestsRes.value.data;
          if (receiptsRes.status === "fulfilled" && receiptsRes.value?.data) updated.receipts = receiptsRes.value.data;
          return updated;
        });
      } catch (e) {
        console.warn("Could not fetch initial data from backend, using local state:", e);
      }
    }

    fetchBackendData();
  }, []);

  // Backend API Sync Helper
  async function apiCall(endpoint, method = "GET", body = null) {
    try {
      const opts = { method, headers: {} };
      if (body) {
        opts.headers["Content-Type"] = "application/json";
        opts.body = JSON.stringify(body);
      }
      const token = sessionStorage.getItem("pcte_token");
      if (token) {
        opts.headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(endpoint, opts);
      return await res.json();
    } catch (e) {
      console.warn(`API call ${method} ${endpoint} failed:`, e.message);
    }
  }

  // Outpass Handlers
  function applyOutpass(outpassData) {
    const newOutpass = {
      id: "out_" + Date.now(),
      createdAt: new Date().toISOString(),
      status: "pending",
      approvedBy: null,
      ...outpassData,
    };
    setData((prev) => ({
      ...prev,
      outpasses: [newOutpass, ...prev.outpasses],
    }));
    apiCall("/api/outpasses", "POST", newOutpass);
    return newOutpass;
  }

  function resolveOutpass(outpassId, decision, approvedBy = "Chief Hostel Warden") {
    setData((prev) => ({
      ...prev,
      outpasses: prev.outpasses.map((o) =>
        o.id === outpassId ? { ...o, status: decision, approvedBy: decision === "approved" ? approvedBy : null } : o
      ),
    }));
    apiCall(`/api/outpasses/${outpassId}/resolve`, "PATCH", { decision, approvedBy });
  }

  function checkInOutpass(outpassId, status) {
    setData((prev) => ({
      ...prev,
      outpasses: prev.outpasses.map((o) => (o.id === outpassId ? { ...o, status } : o)),
    }));
    apiCall(`/api/outpasses/${outpassId}/checkin`, "PATCH", { status });
  }

  // Complaint / Maintenance Handlers
  function submitComplaint(complaintData) {
    const newComplaint = {
      id: "cmp_" + Date.now().toString().slice(-4),
      createdAt: new Date().toISOString(),
      status: "reported",
      technician: "Unassigned",
      ...complaintData,
    };
    setData((prev) => ({
      ...prev,
      complaints: [newComplaint, ...prev.complaints],
    }));
    apiCall("/api/complaints", "POST", newComplaint);
    return newComplaint;
  }

  function assignComplaint(complaintId, technicianName) {
    setData((prev) => ({
      ...prev,
      complaints: prev.complaints.map((c) =>
        c.id === complaintId ? { ...c, technician: technicianName, status: "assigned" } : c
      ),
    }));
    apiCall(`/api/complaints/${complaintId}/assign`, "PATCH", { technicianName });
  }

  function updateComplaintStatus(complaintId, newStatus) {
    setData((prev) => ({
      ...prev,
      complaints: prev.complaints.map((c) =>
        c.id === complaintId ? { ...c, status: newStatus, resolvedAt: newStatus === "resolved" ? new Date().toISOString() : c.resolvedAt } : c
      ),
    }));
    apiCall(`/api/complaints/${complaintId}/status`, "PATCH", { status: newStatus });
  }

  // Notice Board Handlers
  function postNotice(noticeData) {
    const newNotice = {
      id: "not_" + Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      author: noticeData.author || "Hostel Administration",
      ...noticeData,
    };
    setData((prev) => ({
      ...prev,
      notices: [newNotice, ...prev.notices],
    }));
    apiCall("/api/notices", "POST", newNotice);
    return newNotice;
  }

  function deleteNotice(noticeId) {
    setData((prev) => ({
      ...prev,
      notices: prev.notices.filter((n) => n.id !== noticeId),
    }));
    apiCall(`/api/notices/${noticeId}`, "DELETE");
  }

  // Mess & Meal Handlers
  function toggleMealSkip(collegeId, mealKey) {
    setData((prev) => {
      const studentSkips = prev.mealSkips[collegeId] || [];
      const alreadySkipped = studentSkips.includes(mealKey);
      const nextSkips = alreadySkipped
        ? studentSkips.filter((m) => m !== mealKey)
        : [...studentSkips, mealKey];

      return {
        ...prev,
        mealSkips: {
          ...prev.mealSkips,
          [collegeId]: nextSkips,
        },
      };
    });
    apiCall("/api/mess/skips/toggle", "POST", { collegeId, mealKey });
  }

  // Attendance Handlers
  function markAttendance(dateKey, collegeId, status) {
    setData((prev) => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        [dateKey]: {
          ...(prev.attendance[dateKey] || {}),
          [collegeId]: status,
        },
      },
    }));
    apiCall("/api/attendance/mark", "POST", { date: dateKey, collegeId, status });
  }

  function bulkMarkAttendance(dateKey, statusMap) {
    setData((prev) => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        [dateKey]: {
          ...(prev.attendance[dateKey] || {}),
          ...statusMap,
        },
      },
    }));
    apiCall("/api/attendance/bulk", "POST", { date: dateKey, statusMap });
  }

  // Marketplace Handlers
  function addMarketplaceItem(itemData) {
    const newItem = {
      id: "mkt_" + Date.now(),
      ...itemData,
    };
    setData((prev) => ({
      ...prev,
      marketplace: [newItem, ...prev.marketplace],
    }));
    apiCall("/api/marketplace", "POST", newItem);
    return newItem;
  }

  // Check-in Inventory Handlers
  function verifyInventoryItem(itemId, verified) {
    setData((prev) => ({
      ...prev,
      inventoryChecklist: prev.inventoryChecklist.map((item) =>
        item.id === itemId ? { ...item, verified } : item
      ),
    }));
    apiCall(`/api/inventory/${itemId}/verify`, "PATCH", { verified });
  }

  // Room Allotment / Student Handlers (Existing)
  function submitPreferences(collegeId, prefs) {
    setData((prev) => ({
      ...prev,
      studentPreferences: {
        ...prev.studentPreferences,
        [collegeId]: { ...prefs, submitted: true },
      },
    }));
    apiCall(`/api/students/${collegeId}/preferences`, "POST", prefs);
  }

  function payFee(collegeId, details = {}) {
    const txnId = "PCTE-" + Math.floor(100000 + Math.random() * 900000);
    const receipt = {
      txnId,
      collegeId,
      date: new Date().toISOString(),
      amount: details.amount || "₹60,000",
      installment: details.installment || "1st Installment",
      paymentMethod: details.method || "UPI",
    };

    setData((prev) => {
      let allottedRoomName = null;
      let allottedBlock = null;
      let allottedType = null;

      const targetStudent = prev.students.find(
        (s) => s.collegeId?.toLowerCase() === collegeId?.toLowerCase()
      );

      const needsRoom =
        !targetStudent ||
        !targetStudent.room ||
        targetStudent.room === "Unassigned" ||
        targetStudent.status !== "allotted";

      let nextRooms = [...prev.rooms];
      if (needsRoom) {
        // Preferred block check
        const prefBlock = targetStudent?.block;
        let roomIdx = -1;
        if (prefBlock && prefBlock !== "Not Allotted" && prefBlock !== "Pending Allotment") {
          roomIdx = nextRooms.findIndex(
            (rm) => rm.block === prefBlock && !rm.maintenance && rm.occupied < rm.capacity
          );
        }
        if (roomIdx < 0) {
          roomIdx = nextRooms.findIndex(
            (rm) => !rm.maintenance && rm.occupied < rm.capacity
          );
        }

        if (roomIdx >= 0) {
          const rm = nextRooms[roomIdx];
          const studentName = targetStudent?.name || "Student Resident";
          const newOccupants = rm.students.includes(studentName)
            ? rm.students
            : [...rm.students, studentName];

          nextRooms[roomIdx] = {
            ...rm,
            students: newOccupants,
            occupied: newOccupants.length,
          };
          allottedRoomName = rm.room;
          allottedBlock = rm.block;
          allottedType = rm.type;
        }
      }

      const studentExists = prev.students.some(
        (s) => s.collegeId?.toLowerCase() === collegeId?.toLowerCase()
      );

      const updatedStudents = studentExists
        ? prev.students.map((s) => {
            if (s.collegeId?.toLowerCase() === collegeId?.toLowerCase()) {
              return {
                ...s,
                feeStatus: "paid",
                room: allottedRoomName || s.room || "B-104",
                block: allottedBlock || s.block || "Block B",
                roomType: allottedType || s.roomType || "Single",
                status: "allotted",
              };
            }
            return s;
          })
        : [
            ...prev.students,
            {
              collegeId,
              name: targetStudent?.name || "Student Resident",
              feeStatus: "paid",
              room: allottedRoomName || "B-104",
              block: allottedBlock || "Block B",
              roomType: allottedType || "Single",
              status: "allotted",
            },
          ];

      return {
        ...prev,
        rooms: nextRooms,
        students: updatedStudents,
        receipts: [receipt, ...prev.receipts],
      };
    });

    apiCall(`/api/students/${collegeId}/pay`, "POST", details);
    return receipt;
  }

  function requestRoomChange({ studentName, collegeId, fromRoom, toRoom, reason }) {
    const newRequest = {
      id: "req_" + Date.now(),
      student: studentName,
      collegeId,
      from: fromRoom,
      to: toRoom,
      reason,
      status: "pending",
    };

    setData((prev) => ({
      ...prev,
      requests: [newRequest, ...prev.requests],
    }));

    apiCall("/api/students/requests", "POST", { studentName, collegeId, fromRoom, toRoom, reason });
    return newRequest;
  }

  function resolveRequest(requestIdOrIndex, decision) {
    let targetReqId;
    setData((prev) => {
      let targetReq;
      if (typeof requestIdOrIndex === "number") {
        targetReq = prev.requests[requestIdOrIndex];
      } else {
        targetReq = prev.requests.find((r) => r.id === requestIdOrIndex);
      }

      if (!targetReq) return prev;
      targetReqId = targetReq.id;

      const updatedRequests = prev.requests.map((r) =>
        (r.id === targetReq.id || r === targetReq) ? { ...r, status: decision } : r
      );

      if (decision !== "approved") {
        return { ...prev, requests: updatedRequests };
      }

      const studentName = targetReq.student;
      const fromRoom = targetReq.from;
      const toRoom = targetReq.to;

      const updatedStudents = prev.students.map((s) => {
        if (s.name.toLowerCase() === studentName.toLowerCase() || (targetReq.collegeId && s.collegeId === targetReq.collegeId)) {
          const targetRoomObj = prev.rooms.find((rm) => rm.room.toLowerCase() === toRoom.toLowerCase());
          return {
            ...s,
            room: toRoom,
            block: targetRoomObj ? targetRoomObj.block : s.block,
          };
        }
        return s;
      });

      const updatedRooms = prev.rooms.map((rm) => {
        if (rm.room.toLowerCase() === fromRoom.toLowerCase()) {
          const nextStudents = rm.students.filter((name) => name.toLowerCase() !== studentName.toLowerCase());
          return {
            ...rm,
            students: nextStudents,
            occupied: Math.max(0, nextStudents.length),
          };
        }
        if (rm.room.toLowerCase() === toRoom.toLowerCase()) {
          const nextStudents = rm.students.includes(studentName) ? rm.students : [...rm.students, studentName];
          return {
            ...rm,
            students: nextStudents,
            occupied: nextStudents.length,
          };
        }
        return rm;
      });

      return {
        ...prev,
        requests: updatedRequests,
        students: updatedStudents,
        rooms: updatedRooms,
      };
    });

    if (targetReqId) {
      apiCall(`/api/students/requests/${targetReqId}/resolve`, "PATCH", { decision });
    }
  }

  function runAllotment() {
    let count = 0;
    setData((prev) => {
      const nextRooms = prev.rooms.map((r) => ({ ...r, students: [...r.students] }));
      const nextStudents = prev.students.map((student) => {
        if (student.status !== "pending") return student;

        const targetRoom = nextRooms.find(
          (rm) =>
            !rm.maintenance &&
            rm.occupied < rm.capacity &&
            (rm.block.toLowerCase() === student.block.toLowerCase() || true)
        );

        if (targetRoom) {
          targetRoom.students.push(student.name);
          targetRoom.occupied += 1;
          count += 1;
          return {
            ...student,
            room: targetRoom.room,
            block: targetRoom.block,
            status: "allotted",
          };
        }
        return student;
      });

      return {
        ...prev,
        students: nextStudents,
        rooms: nextRooms,
      };
    });

    apiCall("/api/rooms/allotment/run", "POST");
    return count;
  }

  function cycleFeeStatus(collegeId) {
    setData((prev) => ({
      ...prev,
      students: prev.students.map((s) => {
        if (s.collegeId === collegeId) {
          const nextStatus = s.feeStatus === "paid" ? "unpaid" : s.feeStatus === "unpaid" ? "pending" : "paid";
          return { ...s, feeStatus: nextStatus };
        }
        return s;
      }),
    }));
    apiCall(`/api/students/${collegeId}/fee-status`, "PATCH");
  }

  function addStudent(studentData) {
    setData((prev) => {
      const nextStudents = [studentData, ...prev.students];
      const nextRooms = prev.rooms.map((rm) => {
        if (rm.room.toLowerCase() === studentData.room.trim().toLowerCase()) {
          const students = rm.students.includes(studentData.name) ? rm.students : [...rm.students, studentData.name];
          return {
            ...rm,
            students,
            occupied: students.length,
          };
        }
        return rm;
      });

      return {
        ...prev,
        students: nextStudents,
        rooms: nextRooms,
      };
    });
    apiCall("/api/students", "POST", studentData);
  }

  function addHostelBlock({ name, totalRooms = 15 }) {
    setData((prev) => {
      const exists = prev.hostels.some((h) => h.name.toLowerCase() === name.toLowerCase());
      if (exists) return prev;

      const newHostel = { name, rooms: Number(totalRooms), occupied: 0 };
      const blockLetter = name.replace(/[^A-Za-z0-9]/g, "").slice(-1).toUpperCase() || "D";
      const newRooms = [
        { room: `${blockLetter}-101`, block: name, floor: 1, type: "Single", capacity: 1, occupied: 0, students: [], maintenance: false },
        { room: `${blockLetter}-102`, block: name, floor: 1, type: "Double", capacity: 2, occupied: 0, students: [], maintenance: false },
        { room: `${blockLetter}-103`, block: name, floor: 1, type: "Double", capacity: 2, occupied: 0, students: [], maintenance: false },
      ];

      return {
        ...prev,
        hostels: [...prev.hostels, newHostel],
        rooms: [...prev.rooms, ...newRooms],
      };
    });
    apiCall("/api/hostels", "POST", { name, totalRooms });
  }

  function flagMaintenance(roomNumber, isMaintenance = true) {
    setData((prev) => ({
      ...prev,
      rooms: prev.rooms.map((rm) =>
        rm.room.toLowerCase() === roomNumber.toLowerCase() ? { ...rm, maintenance: isMaintenance } : rm
      ),
    }));
    apiCall(`/api/rooms/${roomNumber}/maintenance`, "PATCH", { isMaintenance });
  }

  return (
    <HostelDataContext.Provider
      value={{
        students: data.students,
        rooms: data.rooms,
        hostels: data.hostels,
        requests: data.requests,
        receipts: data.receipts,
        outpasses: data.outpasses,
        complaints: data.complaints,
        notices: data.notices,
        messMenu: data.messMenu,
        mealSkips: data.mealSkips,
        marketplace: data.marketplace,
        attendance: data.attendance,
        inventoryChecklist: data.inventoryChecklist,
        studentPreferences: data.studentPreferences,
        applyOutpass,
        resolveOutpass,
        checkInOutpass,
        submitComplaint,
        assignComplaint,
        updateComplaintStatus,
        postNotice,
        deleteNotice,
        toggleMealSkip,
        markAttendance,
        bulkMarkAttendance,
        addMarketplaceItem,
        verifyInventoryItem,
        submitPreferences,
        payFee,
        requestRoomChange,
        resolveRequest,
        runAllotment,
        cycleFeeStatus,
        addStudent,
        addHostelBlock,
        flagMaintenance,
      }}
    >
      {children}
    </HostelDataContext.Provider>
  );
}

export function useHostelData() {
  const context = useContext(HostelDataContext);
  if (!context) {
    throw new Error("useHostelData must be used within a HostelDataProvider");
  }
  return context;
}
