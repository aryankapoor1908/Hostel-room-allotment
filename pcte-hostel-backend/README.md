# PCTE Hostel Management Backend API

Production-ready Express.js and MongoDB REST API backend for the **PCTE Hostel Room Allotment & Management Portal**.

---

## 🌟 Key Features

- **Authentication & Authorization**:
  - Role-based JWT authentication (`student` and `admin`).
  - Passwords hashed using bcrypt.
  - Token verification middleware (`authenticateToken`, `requireRole`).
- **Database Architecture**:
  - **Primary**: MongoDB with Mongoose ODM schemas, indexes, and validation.
  - **Zero-Downtime Offline Fallback**: If MongoDB daemon is offline or connection times out, automatically falls back to an embedded persistent local store (`data/local_db.json`) so development and frontend testing never break.
- **Hostel Blocks & Room Management**:
  - Real-time room occupancy and capacity tracking.
  - Maintenance flagging and unflagging.
  - Automated intelligent room allotment engine.
- **Outpass & Gate Pass System**:
  - Day outings and night leaves with approvals and check-in/out logging.
- **Maintenance & Complaints Helpdesk**:
  - Ticket lifecycle: reported -> assigned -> in_progress -> resolved.
  - Category filtering, technician assignment, priority management.
- **Mess & Dining**:
  - Daily meal schedule (breakfast, lunch, snacks, dinner).
  - Student meal skip toggle.
- **Student Marketplace**:
  - Student peer-to-peer buy/sell and lost & found notices.
- **Night Roll-Call Attendance**:
  - Date-based biometric / roll-call attendance logs.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd pcte-hostel-backend
npm install
```

### 2. Configure Environment (`.env`)
Create or edit `.env` in `pcte-hostel-backend/`:
```env
PORT=5000
NODE_ENV=development
# Use local MongoDB or MongoDB Atlas URI:
MONGODB_URI=mongodb://127.0.0.1:27017/pcte_hostel
JWT_SECRET=pcte_hostel_jwt_secret_key_2026_super_secure
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database (Optional for MongoDB)
To pre-populate MongoDB with demo students, rooms, hostels, notices, complaints, and menu:
```bash
npm run seed
```

### 4. Start Server
Development mode with file watcher:
```bash
npm run dev
```

Standard start:
```bash
npm start
```

Server will run at: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

---

## 🔑 Demo Credentials

| Role | Username / College ID | Password | Access Level |
|---|---|---|---|
| **Student** | `BCA0140` | `student123` | Student Dashboard, Outpass application, Complaints, Mess skips, Room preference |
| **Admin** | `admin` | `admin123` | Full Admin Dashboard, Room allotment, Block creation, Maintenance, Approvals |

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login with `{ role, loginId, password }` | None |
| `POST` | `/api/auth/register` | Register new student account | None |
| `GET` | `/api/auth/me` | Get current authenticated user profile | Bearer Token |

### 🏢 Hostels (`/api/hostels`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/hostels` | Get list of all hostel blocks | None |
| `POST` | `/api/hostels` | Add a new hostel block (`{ name, totalRooms }`) | None |

### 🛏️ Rooms (`/api/rooms`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/rooms` | Get rooms (query: `block`, `floor`, `maintenance`) | None |
| `PATCH` | `/api/rooms/:roomNumber/maintenance` | Flag/unflag room maintenance | None |
| `POST` | `/api/rooms/allotment/run` | Execute auto room allotment algorithm | None |

### 👨‍🎓 Students & Requests (`/api/students`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/students` | Get all registered students | None |
| `POST` | `/api/students` | Register/add a new student | None |
| `PATCH` | `/api/students/:collegeId/fee-status` | Cycle/update fee status (`paid`, `unpaid`, `pending`) | None |
| `POST` | `/api/students/:collegeId/preferences` | Submit hostel room preferences | None |
| `POST` | `/api/students/:collegeId/pay` | Process fee payment & generate receipt | None |
| `GET` | `/api/students/receipts/all` | Get payment receipts (filter by `collegeId`) | None |
| `GET` | `/api/students/requests/all` | Get room change requests | None |
| `POST` | `/api/students/requests` | Submit room change request | None |
| `PATCH` | `/api/students/requests/:id/resolve`| Approve or reject room change request | None |

### 🎫 Outpasses / Gate Passes (`/api/outpasses`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/outpasses` | Get outpasses (filter by `collegeId`, `status`) | None |
| `POST` | `/api/outpasses` | Submit new outpass application | None |
| `PATCH` | `/api/outpasses/:id/resolve` | Approve or reject outpass | None |
| `PATCH` | `/api/outpasses/:id/checkin` | Update status (checked out, returned) | None |

### 🛠️ Complaints & Maintenance (`/api/complaints`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/complaints` | Get tickets (filter: `collegeId`, `status`, `category`)| None |
| `POST` | `/api/complaints` | Submit maintenance ticket | None |
| `PATCH` | `/api/complaints/:id/assign` | Assign technician | None |
| `PATCH` | `/api/complaints/:id/status` | Update status (`assigned`, `in_progress`, `resolved`) | None |

### 📢 Notices (`/api/notices`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/notices` | Get all published notices | None |
| `POST` | `/api/notices` | Publish new notice | None |
| `DELETE`| `/api/notices/:id` | Delete notice | None |

### 🍛 Mess & Dining (`/api/mess`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/mess/menu` | Get weekly mess menu | None |
| `PUT` | `/api/mess/menu` | Update mess menu for a day | None |
| `GET` | `/api/mess/skips/:collegeId` | Get student meal skips | None |
| `POST` | `/api/mess/skips/toggle` | Toggle student meal skip | None |

### 📋 Attendance (`/api/attendance`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/attendance?date=YYYY-MM-DD` | Get attendance for date | None |
| `POST` | `/api/attendance/mark` | Mark individual student attendance | None |
| `POST` | `/api/attendance/bulk` | Bulk mark attendance for date | None |

### 🛒 Marketplace (`/api/marketplace`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/marketplace` | Get student listings | None |
| `POST` | `/api/marketplace` | Add marketplace listing | None |
| `DELETE`| `/api/marketplace/:id` | Delete listing | None |

### 📦 Room Inventory (`/api/inventory`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/inventory` | Get checklist of fixtures | None |
| `PATCH` | `/api/inventory/:id/verify` | Verify/unverify fixture | None |
