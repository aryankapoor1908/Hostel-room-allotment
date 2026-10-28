import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import {
  INITIAL_USERS,
  INITIAL_HOSTELS,
  INITIAL_ROOMS,
  INITIAL_STUDENTS,
  INITIAL_REQUESTS,
  INITIAL_OUTPASSES,
  INITIAL_COMPLAINTS,
  INITIAL_NOTICES,
  INITIAL_MESS_MENU,
  INITIAL_MARKETPLACE,
  INITIAL_INVENTORY_CHECKLIST,
  INITIAL_ATTENDANCE,
  INITIAL_PREFERENCES,
} from "../seed/seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "local_db.json");

let memoryStore = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getStore() {
  if (memoryStore) return memoryStore;

  ensureDataDir();

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      memoryStore = JSON.parse(content);
      return memoryStore;
    } catch (e) {
      console.warn("Failed to read local_db.json, creating new default store:", e.message);
    }
  }

  // Initialize with seed data and hashed passwords
  const usersWithHashedPass = INITIAL_USERS.map((u) => ({
    ...u,
    password: bcrypt.hashSync(u.password, 10),
  }));

  memoryStore = {
    users: usersWithHashedPass,
    hostels: INITIAL_HOSTELS,
    rooms: INITIAL_ROOMS,
    students: INITIAL_STUDENTS,
    requests: INITIAL_REQUESTS,
    outpasses: INITIAL_OUTPASSES,
    complaints: INITIAL_COMPLAINTS,
    notices: INITIAL_NOTICES,
    messMenu: INITIAL_MESS_MENU,
    mealSkips: { BCA0140: [] },
    marketplace: INITIAL_MARKETPLACE,
    inventoryChecklist: INITIAL_INVENTORY_CHECKLIST,
    attendance: INITIAL_ATTENDANCE,
    studentPreferences: INITIAL_PREFERENCES,
    receipts: [],
  };

  saveStore();
  return memoryStore;
}

export function saveStore() {
  if (!memoryStore) return;
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving to local_db.json:", e);
  }
}
