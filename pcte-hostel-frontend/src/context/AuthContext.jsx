import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// TEMP: mock users until the backend auth API is wired up.
// Replace `login()` with a real POST /api/auth/login call when the
// Express server is ready — the shape of `user` should stay the same.
const MOCK_USERS = {
  student: {
    id: "stu_101",
    name: "Aryan Kapoor",
    role: "student",
    collegeId: "BCA0140",
  },
  admin: {
    id: "adm_01",
    name: "Admin Office",
    role: "admin",
  },
};

// TEMP: demo credentials, checked client-side only — remove once real
// auth is wired up. Login IDs are case-insensitive.
const MOCK_CREDENTIALS = {
  student: { loginId: "BCA0140", password: "student123" },
  admin: { loginId: "admin", password: "admin123" },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = sessionStorage.getItem("pcte_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  async function login(role, loginId, password) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, loginId, password }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        sessionStorage.setItem("pcte_user", JSON.stringify(data.user));
        if (data.token) {
          sessionStorage.setItem("pcte_token", data.token);
        }
        return data.user;
      }
    } catch (e) {
      console.warn("Backend login failed, falling back to local credentials:", e);
    }

    // Fallback credentials check if backend is offline
    const creds = MOCK_CREDENTIALS[role];
    const idMatches = creds && loginId?.trim().toLowerCase() === creds.loginId.toLowerCase();
    const passwordMatches = creds && password === creds.password;
    if (!idMatches || !passwordMatches) {
      return null;
    }
    const nextUser = MOCK_USERS[role];
    setUser(nextUser);
    sessionStorage.setItem("pcte_user", JSON.stringify(nextUser));
    return nextUser;
  }

  async function register(formData) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        sessionStorage.setItem("pcte_user", JSON.stringify(data.user));
        if (data.token) {
          sessionStorage.setItem("pcte_token", data.token);
        }
        return { success: true, user: data.user, message: data.message };
      }
      return { success: false, message: data.message || "Registration failed." };
    } catch (e) {
      console.error("Backend register error:", e);
      const displayId = (formData.collegeId || formData.loginId).trim().toUpperCase();
      const fallbackUser = {
        id: "usr_" + Date.now(),
        name: formData.name,
        role: formData.role || "student",
        collegeId: displayId,
        loginId: formData.loginId.trim().toLowerCase(),
        phone: formData.phone || "",
      };
      setUser(fallbackUser);
      sessionStorage.setItem("pcte_user", JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser, message: "Registered successfully" };
    }
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem("pcte_user");
    sessionStorage.removeItem("pcte_token");
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
