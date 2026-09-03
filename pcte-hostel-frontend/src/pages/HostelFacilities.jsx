import { Link } from "react-router-dom";
import { ArrowLeft, Info, IndianRupee, FileCheck, GraduationCap, Landmark, CreditCard, BedDouble, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import SectionTabs from "../components/SectionTabs";
import HostelStatsStrip from "../components/HostelStatsStrip";
import AuthNavAction from "../components/AuthNavAction";
import AdmissionsInfoContent from "../components/AdmissionsInfoContent";

const CAMPUS_ADDRESS = "Baddowal–Ferozepur Road, Opp. ITBP, Baddowal, Ludhiana – 142021, Punjab, India";

const INFO_TABS = [
  { key: "overview", label: "Overview", icon: Info },
  { key: "fees", label: "Course Fees & Eligibility", icon: IndianRupee },
  { key: "how-to-apply", label: "How to Apply", icon: FileCheck },
  { key: "scholarship", label: "Scholarship", icon: GraduationCap },
  { key: "loan", label: "Education Loan", icon: Landmark },
  { key: "pay", label: "Pay Your Fees", icon: CreditCard },
  { key: "facilities", label: "Hostel Facilities", icon: BedDouble },
];

export default function HostelFacilities() {
  const [infoTab, setInfoTab] = useState("facilities");

  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-navy text-white/70 text-xs border-b border-white/8">
        <div className="max-w-6xl mx-auto px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-goldLight" /> 0161-2888500
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Mail size={12} className="text-goldLight" /> hostels@pcte.edu.in
            </span>
          </div>
          <span className="hidden sm:inline">Affiliated to IKG Punjab Technical University · Approved by AICTE</span>
        </div>
      </div>

      <header className="px-8 py-4 flex items-center justify-between border-b border-line bg-card" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition-colors">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <AuthNavAction />
      </header>

      <HostelStatsStrip />

      <div className="max-w-3xl mx-auto px-8 pt-2 pb-16">
        <p className="text-xs uppercase tracking-widest text-brand font-mono mb-2">
          Session 2026–27
        </p>
        <h1 className="font-display font-extrabold text-3xl text-navy mb-1">Hostel Facilities & Fees</h1>
        <p className="text-sm text-muted mb-2 max-w-lg">
          Room types, pricing, and availability for boys' and girls' hostel blocks. No login
          needed to browse — sign in once you're ready to submit your room preference.
        </p>

        <SectionTabs
          flagLabel="Admissions Info"
          tabs={INFO_TABS}
          activeKey={infoTab}
          onChange={setInfoTab}
        />

        <div className="mt-4">
          <AdmissionsInfoContent activeTab={infoTab} />
        </div>

        <div className="mt-8 bg-white border border-line rounded p-5 max-w-3xl">
          <p className="text-sm text-slate">
            Ready to apply for a room?{" "}
            <Link to="/login" className="text-brass font-medium hover:underline">
              Sign in to submit your preferences →
            </Link>
          </p>
        </div>
      </div>

      <footer className="bg-inkdeep text-white/70">
        <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm flex items-center gap-2"><MapPin size={14} className="text-brassLight" /> {CAMPUS_ADDRESS}</p>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} PCTE Group of Institutes</p>
        </div>
      </footer>
    </div>
  );
}
