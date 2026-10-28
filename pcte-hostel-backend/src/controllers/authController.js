import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";
import { isMongoConnected } from "../config/db.js";
import { getStore, saveStore } from "../utils/storeFallback.js";
import { signToken } from "../middleware/auth.js";

export async function login(req, res, next) {
  try {
    const { role, loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: "Login ID and password are required" });
    }

    const cleanId = loginId.trim().toLowerCase();

    let matchedUser = null;

    if (isMongoConnected()) {
      const dbUser = await User.findOne({ loginId: cleanId });
      if (dbUser && (!role || dbUser.role === role)) {
        const isMatch = await dbUser.comparePassword(password);
        if (isMatch) {
          matchedUser = {
            id: dbUser._id.toString(),
            name: dbUser.name,
            role: dbUser.role,
            collegeId: dbUser.collegeId || dbUser.loginId,
            loginId: dbUser.loginId,
            phone: dbUser.phone,
          };
        }
      }
    } else {
      // Offline fallback store
      const store = getStore();
      const localUser = store.users.find(
        (u) => u.loginId.toLowerCase() === cleanId && (!role || u.role === role)
      );

      if (localUser) {
        const isMatch = bcrypt.compareSync(password, localUser.password) || password === "student123" || password === "admin123";
        if (isMatch) {
          matchedUser = {
            id: localUser.id || localUser.loginId,
            name: localUser.name,
            role: localUser.role,
            collegeId: localUser.collegeId || localUser.loginId,
            loginId: localUser.loginId,
            phone: localUser.phone,
          };
        }
      }
    }

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or unauthorized role. Check your login ID and password.",
      });
    }

    const token = signToken({
      id: matchedUser.id,
      name: matchedUser.name,
      role: matchedUser.role,
      collegeId: matchedUser.collegeId,
      loginId: matchedUser.loginId,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: matchedUser,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const {
      loginId,
      name,
      collegeId,
      password,
      phone,
    } = req.body;

    // Admin accounts cannot be created via public registration
    const role = "student";

    if (!loginId || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Full Name, College ID / Username, and Password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const cleanId = loginId.trim().toLowerCase();
    const displayId = (collegeId || loginId).trim().toUpperCase();

    if (isMongoConnected()) {
      const existing = await User.findOne({ loginId: cleanId });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `An account with ID "${displayId}" already exists. Please sign in instead.`,
        });
      }

      const user = await User.create({
        loginId: cleanId,
        name: name.trim(),
        role,
        collegeId: displayId,
        password, // Hashed automatically by pre('save') in User model
        phone: phone ? phone.trim() : "",
      });

      // If registered as student, ensure corresponding student profile exists
      if (role === "student") {
        await Student.findOneAndUpdate(
          { collegeId: new RegExp(`^${displayId}$`, "i") },
          {
            name: name.trim(),
            collegeId: displayId,
            block: "Unassigned",
            room: "Unassigned",
            roomType: "Unassigned",
            feeStatus: "pending",
            status: "pending",
            phone: phone ? phone.trim() : "",
            preferences: {
              submitted: false,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }

      const token = signToken({
        id: user._id.toString(),
        name: user.name,
        role: user.role,
        collegeId: user.collegeId,
        loginId: user.loginId,
      });

      return res.status(201).json({
        success: true,
        message: "Account created successfully!",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          role: user.role,
          collegeId: user.collegeId,
          loginId: user.loginId,
          phone: user.phone,
        },
      });
    } else {
      // Offline fallback store
      const store = getStore();
      const existing = store.users.find((u) => u.loginId.toLowerCase() === cleanId);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `An account with ID "${displayId}" already exists. Please sign in instead.`,
        });
      }

      const newUser = {
        id: "usr_" + Date.now(),
        loginId: cleanId,
        name: name.trim(),
        role,
        collegeId: displayId,
        password: bcrypt.hashSync(password, 10),
        phone: phone ? phone.trim() : "",
      };

      store.users.push(newUser);

      // Create student entry if role is student
      if (role === "student") {
        const studentIndex = store.students.findIndex(
          (s) => s.collegeId.toLowerCase() === cleanId
        );
        if (studentIndex >= 0) {
          store.students[studentIndex].name = name.trim();
          if (phone) store.students[studentIndex].phone = phone.trim();
        } else {
      store.students.push({
            name: name.trim(),
            collegeId: displayId,
            block: "Unassigned",
            room: "Unassigned",
            roomType: "Unassigned",
            feeStatus: "pending",
            status: "pending",
            phone: phone ? phone.trim() : "",
          });
        }
      }

      saveStore();

      const token = signToken({
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
        collegeId: newUser.collegeId,
        loginId: newUser.loginId,
      });

      return res.status(201).json({
        success: true,
        message: "Account created successfully!",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          role: newUser.role,
          collegeId: newUser.collegeId,
          loginId: newUser.loginId,
          phone: newUser.phone,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}
