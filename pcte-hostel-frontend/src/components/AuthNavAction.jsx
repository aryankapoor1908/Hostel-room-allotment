import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthNavAction() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="text-xs sm:text-sm font-medium text-slate hover:text-ink px-3 py-1.5 rounded-lg hover:bg-paper transition-colors"
        >
          Sign in
        </Link>
        <Link
          to="/signup"
          className="text-xs sm:text-sm font-semibold text-white bg-navy hover:bg-navyDeep px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
        >
          Register
        </Link>
      </div>
    );
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        to={`/${user.role}`}
        className="text-sm font-medium text-slate hover:text-ink hidden sm:inline transition-colors"
      >
        {user.name?.split(" ")[0]}'s dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-sm font-semibold text-white bg-navy hover:bg-navyDeep px-4 py-2 rounded-lg transition-colors shadow-sm"
      >
        <LogOut size={14} /> Sign out
      </button>
    </div>
  );
}
