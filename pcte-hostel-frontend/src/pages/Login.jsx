import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import pcteLogo from "../assets/pcte-logo.svg";

const ROLES = [
  { key: "student", label: "Student" },
  { key: "admin", label: "Admin" },
];

const DEMO_HINT = {
  student: { loginId: "BCA0140", password: "student123" },
  admin: { loginId: "admin", password: "admin123" },
};

export default function Login() {
  const [role, setRole]         = useState("student");
  const [id, setId]             = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const { login }  = useAuth();
  const navigate   = useNavigate();


  function handleRoleChange(nextRole) {
    setRole(nextRole);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const user = await login(role, id, password);
    if (!user) {
      setError("Incorrect ID or password. Check the demo credentials below.");
      return;
    }
    setError("");
    navigate(`/${user.role}`);
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <img src={pcteLogo} alt="PCTE Group of Institutes" className="w-24 h-24 object-contain mx-auto mb-3" />
        <p className="font-display text-2xl text-ink text-center mb-1">PCTE Hostels</p>
        <p className="text-sm text-muted text-center mb-8">Sign in to your allotment account</p>

        <div className="bg-white border border-line rounded p-7 min-h-[355px] flex flex-col justify-center card-elevated">
          <div className="flex gap-1 bg-paper rounded p-1 mb-8">
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => handleRoleChange(r.key)}
                className={`flex-1 text-sm py-2 rounded transition-colors ${role === r.key ? "bg-ink text-white" : "text-muted hover:text-slate"}`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-rejected/10 border border-rejected/30 rounded px-3 py-2.5 mb-4">
              <AlertCircle size={15} className="text-rejected mt-0.5 shrink-0" />
              <p className="text-xs text-rejected">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wide">
                {role === "student" ? "College ID" : "Username"}
              </label>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder={role === "student" ? "BCA0140" : "Enter username"}
                className="w-full mt-2 border border-line rounded px-3 py-3 text-sm font-mono focus-visible:border-brass"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-2 border border-line rounded px-3 py-3 text-sm focus-visible:border-brass"
                required
              />
            </div>

            <div className="pt-3">
              <button type="submit" className="w-full bg-ink text-white py-3 rounded text-sm font-medium hover:bg-inkdeep transition-colors cursor-pointer">
                Sign in as {role}
              </button>
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-line/60 text-center">
            <p className="text-xs text-muted">
              Don't have an allotment account?{" "}
              <Link to="/signup" className="text-brand font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="text-xs text-muted text-center mt-5 space-y-1">
          <p className="font-mono"></p>
          <p className="font-mono text-[11px]">
            Try: <span className="text-slate">{DEMO_HINT[role].loginId}</span> /{" "}
            <span className="text-slate">{DEMO_HINT[role].password}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
