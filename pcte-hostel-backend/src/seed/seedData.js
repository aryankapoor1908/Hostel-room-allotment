export const INITIAL_USERS = [
  {
    loginId: "BCA0140",
    name: "Aryan Kapoor",
    role: "student",
    collegeId: "BCA0140",
    password: "student123", // Will be hashed with bcrypt
    phone: "98765-43210",
  },
  {
    loginId: "admin",
    name: "Admin Office",
    role: "admin",
    collegeId: "adm_01",
    password: "admin123",
    phone: "98140-00000",
  },
];

export const INITIAL_HOSTELS = [
  { name: "Block A", rooms: 24, occupied: 19 },
  { name: "Block B", rooms: 30, occupied: 27 },
  { name: "Block C", rooms: 18, occupied: 11 },
];

export const INITIAL_ROOMS = [
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

export const INITIAL_STUDENTS = [
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

export const INITIAL_REQUESTS = [
  { id: "req_1", student: "Anaya Mehta", collegeId: "PCTE22CS019", from: "B-202", to: "B-201", reason: "Wants to room with sister", status: "pending" },
];

export const INITIAL_OUTPASSES = [
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
    createdAt: "2026-09-03T10:30:00.000Z",
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
    createdAt: "2026-09-03T14:15:00.000Z",
  },
];

export const INITIAL_COMPLAINTS = [
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
    createdAt: "2026-09-02T11:00:00.000Z",
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
    createdAt: "2026-08-31T09:30:00.000Z",
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
    createdAt: "2026-09-03T08:00:00.000Z",
  },
];

export const INITIAL_NOTICES = [
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

export const INITIAL_MESS_MENU = {
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

export const INITIAL_MARKETPLACE = [
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

export const INITIAL_INVENTORY_CHECKLIST = [
  { id: "inv_1", item: "Single/Double Bed with Headboard", condition: "Good", serial: "PCTE-FURN-214-A", verified: true },
  { id: "inv_2", item: "High-Density Foam Mattress", condition: "Clean & Intact", serial: "PCTE-MAT-894", verified: true },
  { id: "inv_3", item: "Study Desk with 2 Storage Drawers", condition: "Good", serial: "PCTE-DSK-214", verified: true },
  { id: "inv_4", item: "Ergonomic Study Chair", condition: "Good", serial: "PCTE-CHR-552", verified: true },
  { id: "inv_5", item: "Built-in Steel Wardrobe with Key", condition: "1 Key Issued", serial: "PCTE-WRD-214", verified: true },
  { id: "inv_6", item: "Usha Ceiling Fan & Regulator", condition: "Working (Reported for servicing)", serial: "PCTE-EL-104", verified: true },
  { id: "inv_7", item: "LED Tube Light Fixtures (x2)", condition: "Both Functional", serial: "PCTE-LGT-214", verified: true },
];

export const INITIAL_ATTENDANCE = {
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
};

export const INITIAL_PREFERENCES = {
  BCA0140: { hostelBlock: "Block B", roomType: "double", roommate: "", submitted: true },
};
