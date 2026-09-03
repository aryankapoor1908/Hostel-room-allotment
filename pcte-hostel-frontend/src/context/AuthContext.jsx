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

  function login(role, loginId, password) {
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

  function logout() {
    setUser(null);
    sessionStorage.removeItem("pcte_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
