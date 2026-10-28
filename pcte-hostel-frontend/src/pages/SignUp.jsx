import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import pcteLogo from "../assets/pcte-logo.svg";

export default function SignUp() {
  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // Basic Validation
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!loginId.trim()) {
      setError("Please enter your College ID / Roll Number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      loginId: loginId.trim(),
      collegeId: loginId.trim().toUpperCase(),
      role: "student",
      password,
      phone: phone.trim(),
    };

    const res = await register(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg("Account created! Redirecting to your dashboard...");
      setTimeout(() => {
        navigate("/student");
      }, 1000);
    } else {
      setError(res.message || "Failed to create account. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img
              src={pcteLogo}
              alt="PCTE Group of Institutes"
              className="w-20 h-20 object-contain mx-auto mb-2"
            />
          </Link>
          <h1 className="font-display text-2xl font-bold text-ink">Join PCTE Hostels</h1>
          <p className="text-xs text-muted mt-1">Create your student account to get started</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-line rounded-xl p-6 sm:p-8 card-elevated shadow-sm">

          {/* Feedback Banners */}
          {error && (
            <div className="flex items-start gap-2 bg-rejected/10 border border-rejected/30 rounded-lg px-3.5 py-2.5 mb-5 animate-in fade-in">
              <AlertCircle size={16} className="text-rejected mt-0.5 shrink-0" />
              <p className="text-xs text-rejected font-medium">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2 bg-confirmed/10 border border-confirmed/30 rounded-lg px-3.5 py-2.5 mb-5 animate-in fade-in">
              <CheckCircle2 size={16} className="text-confirmed mt-0.5 shrink-0" />
              <p className="text-xs text-confirmed font-medium">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-[11px] font-bold text-slate uppercase tracking-wider block mb-1.5">
                Full Name <span className="text-rejected">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand/30 transition-colors"
                required
              />
            </div>

            {/* College ID / Login ID */}
            <div>
              <label className="text-[11px] font-bold text-slate uppercase tracking-wider block mb-1.5">
                College ID / Roll No <span className="text-rejected">*</span>
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Your college roll number"
                className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm font-mono focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand/30 transition-colors"
                required
              />
              <p className="text-[11px] text-muted mt-1">
                Your official college roll number used for all hostel records.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-[11px] font-bold text-slate uppercase tracking-wider block mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your contact number"
                className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm font-mono focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand/30 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate uppercase tracking-wider">
                  Password <span className="text-rejected">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-muted hover:text-ink flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand/30 transition-colors"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[11px] font-bold text-slate uppercase tracking-wider block mb-1.5">
                Confirm Password <span className="text-rejected">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus-visible:ring-1 transition-colors ${
                  confirmPassword && confirmPassword !== password
                    ? "border-rejected focus-visible:border-rejected focus-visible:ring-rejected/30"
                    : confirmPassword && confirmPassword === password
                    ? "border-confirmed focus-visible:border-confirmed focus-visible:ring-confirmed/30"
                    : "border-line focus-visible:border-brand focus-visible:ring-brand/30"
                }`}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-ink text-white py-3 rounded-lg text-sm font-semibold hover:bg-slate active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <Sparkles size={15} className="text-blue-300" />
                    Create Student Account
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Secure Notice */}
          <div className="mt-5 pt-4 border-t border-line/60 flex items-start gap-2 text-[11px] text-muted">
            <ShieldCheck size={14} className="text-confirmed shrink-0 mt-0.5" />
            <span>
              Your account is secured. Hostel allotment is managed by the admin and will be assigned after registration.
            </span>
          </div>
        </div>

        {/* Footer Link to Sign In */}
        <p className="text-xs text-center text-muted mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
