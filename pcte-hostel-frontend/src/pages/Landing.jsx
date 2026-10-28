import { Link } from "react-router-dom";
import {
  ArrowRight, Building2, Users, ShieldCheck, MapPin,
  Phone, Mail, Navigation, Clock,
} from "lucide-react";
import AuthNavAction from "../components/AuthNavAction";
import hostelHero    from "../assets/hostel-hero.jpg";
import hostelDetail1 from "../assets/hostel-detail-1.jpg";
import hostelDetail2 from "../assets/hostel-detail-2.jpg";
import pcteLogo from "../assets/pcte-logo.svg";

const CAMPUS_ADDRESS      = "Baddowal–Ferozepur Road, Opp. ITBP, Baddowal, Ludhiana – 142021, Punjab, India";
const MAPS_EMBED_SRC      = "https://www.google.com/maps?q=PCTE+Group+of+Institutes,+Baddowal+Ferozepur+Road,+Ludhiana,+Punjab+142021&output=embed";
const MAPS_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=PCTE+Group+of+Institutes,+Baddowal+Ferozepur+Road,+Ludhiana,+Punjab+142021";

const FEATURES = [
  {
    icon: Building2,
    title: "3 Hostel Blocks",
    desc:  "Single, double and triple-sharing rooms across Block A, B and C with separate warden offices and common areas.",
  },
  {
    icon: Users,
    title: "First-Come, First-Served",
    desc:  "Preferences submitted early get first pick of block and room type. Allotments are matched and confirmed automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Verified",
    desc:  "Every allotment is logged in the admin portal. Digital outpasses, night roll calls, and fee payment built in.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: "#FFFFFF" }}>

      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="bg-sidebar text-white/60 text-xs border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a href="tel:01612888500" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Phone size={11} /> 0161-2888500
            </a>
            <a href="mailto:hostels@pcte.edu.in" className="hidden sm:flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Mail size={11} /> hostels@pcte.edu.in
            </a>
          </div>
          <span className="hidden md:inline text-white/40">IKG PTU Affiliated · AICTE Approved</span>
        </div>
      </div>

      {/* ── Header ──────────────────────────────────────── */}
      <header className="border-b border-line bg-white px-6 py-0 h-16 flex items-center justify-between sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-md bg-white border border-line flex items-center justify-center overflow-hidden">
            <img src={pcteLogo} alt="PCTE" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink tracking-tight">PCTE Residence</p>
            <p className="text-[10px] text-muted uppercase tracking-widest">Student Services</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <Link to="/hostel-facilities" className="hidden sm:inline px-3 py-1.5 text-[13px] text-muted hover:text-ink rounded-md hover:bg-paper transition-colors">
            Facilities & Fees
          </Link>
          <a href="#find-us" className="hidden sm:inline px-3 py-1.5 text-[13px] text-muted hover:text-ink rounded-md hover:bg-paper transition-colors">
            Find Us
          </a>
          <AuthNavAction />
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden max-w-[1600px] mx-auto md:rounded-b-lg">
        <div className="absolute inset-0">
          <img src={hostelHero} alt="PCTE hostel block" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-sidebar/80" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-200" />
              <span className="text-[11px] text-white/70 font-medium uppercase tracking-widest">Academic session 2026–27</span>
            </div>

            <h1 className="text-5xl md:text-[56px] font-bold text-white leading-[1.07] tracking-tight">
              Residence,<br />with purpose.
            </h1>
            <p className="text-white/60 mt-5 text-base leading-relaxed">
              A considered residential experience for students, supported by clear processes, responsive staff, and one dependable portal.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-brand text-white hover:bg-brandHov px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm"
              >
                Register for Hostel <ArrowRight size={15} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white text-ink hover:bg-white/90 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm"
              >
                Sign In
              </Link>
              <Link
                to="/hostel-facilities"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white/80 hover:text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all"
              >
                Room Types & Fees
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center gap-8">
              {[
                { v: "3",    l: "Blocks" },
                  { v: "30",   l: "Beds" },
                { v: "FCFS", l: "Allotment" },
                { v: "24/7", l: "Security" },
              ].map((s, i) => (
                <div key={s.l} className={`${i > 0 ? "pl-8 border-l border-white/15" : ""}`}>
                  <p className="text-xl font-bold text-white">{s.v}</p>
                  <p className="text-xs text-white/40 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Photo Strip ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 gap-4">
        <figure className="rounded-lg overflow-hidden border border-line group">
          <img src={hostelDetail1} alt="Hostel block" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
        </figure>
        <figure className="rounded-lg overflow-hidden border border-line group">
          <img src={hostelDetail2} alt="Hostel campus" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
        </figure>
      </section>

      {/* ── Feature Cards ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-10 grid sm:grid-cols-3 gap-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white border border-line rounded-lg p-5 hover:border-brand/40 transition-colors">
            <div className="w-8 h-8 bg-brandBg rounded-md flex items-center justify-center mb-4 border border-brandBorder">
              <Icon size={16} className="text-brand" />
            </div>
            <p className="font-semibold text-sm text-ink mb-1.5">{title}</p>
            <p className="text-[13px] text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="bg-sidebar rounded-lg px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5 card-elevated">
          <div>
            <p className="font-semibold text-white text-lg">Ready to submit your room preference?</p>
            <p className="text-white/50 text-sm mt-1">Sign in with your College ID to get started.</p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brandHov text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shrink-0"
          >
            Sign In <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Find Us ─────────────────────────────────────── */}
      <section id="find-us" className="max-w-6xl mx-auto px-6 py-12 border-t border-line">
        <div className="mb-8">
          <p className="text-[11px] text-brand font-semibold uppercase tracking-widest mb-1">Campus Location</p>
          <h2 className="text-2xl font-semibold text-ink">Find Us</h2>
        </div>

        <div className="grid md:grid-cols-5 gap-0 bg-white border border-line rounded-lg overflow-hidden">
          <div className="md:col-span-2 p-6 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <ContactRow icon={MapPin} label="Address" value={CAMPUS_ADDRESS} />
              <ContactRow icon={Phone} label="Phone" value="0161-2888500 / 2888600" />
              <ContactRow icon={Clock} label="Office Hours" value="Mon–Sat, 9:00 AM – 4:40 PM" />
            </div>
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-sidebar hover:bg-navyDeep px-4 py-2.5 rounded-lg transition-colors w-fit"
            >
              <Navigation size={14} /> Get Directions
            </a>
          </div>
          <div className="md:col-span-3 min-h-[280px]">
            <iframe
              title="PCTE campus location"
              src={MAPS_EMBED_SRC}
              className="w-full h-full min-h-[280px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-line bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-md bg-white border border-line flex items-center justify-center overflow-hidden">
                <img src={pcteLogo} alt="PCTE" className="w-full h-full object-contain" />
              </div>
              <p className="font-semibold text-sm text-ink">PCTE Residence</p>
            </div>
            <p className="text-[13px] text-muted leading-relaxed">
              PCTE Group of Institutes, Ludhiana.<br />
              Est. 1999 · IKG PTU Affiliated · AICTE Approved.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-ink uppercase tracking-widest mb-3">Links</p>
            <ul className="space-y-2 text-[13px] text-muted">
              <li><Link to="/hostel-facilities" className="hover:text-ink transition-colors">Hostel Facilities & Fees</Link></li>
              <li><Link to="/login"             className="hover:text-ink transition-colors">Sign In</Link></li>
              <li><a href="#find-us"             className="hover:text-ink transition-colors">Campus Map</a></li>
              <li><a href="https://pcte.edu.in" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">PCTE Website ↗</a></li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-ink uppercase tracking-widest mb-3">Contact</p>
            <div className="space-y-2 text-[13px] text-muted">
              <p className="flex items-start gap-2"><MapPin size={13} className="mt-0.5 shrink-0" />{CAMPUS_ADDRESS}</p>
              <p className="flex items-center gap-2"><Phone size={13} />0161-2888500</p>
              <p className="flex items-center gap-2"><Mail  size={13} />hostels@pcte.edu.in</p>
            </div>
          </div>
        </div>
        <div className="border-t border-line py-4 text-center text-[12px] text-subtle">
          © {new Date().getFullYear()} PCTE Group of Institutes. This portal is a student project and not the official PCTE website.
        </div>
      </footer>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={14} className="text-muted mt-0.5 shrink-0" />
      <div>
        <p className="text-[11px] font-semibold text-ink uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-[13px] text-muted leading-relaxed">{value}</p>
      </div>
    </div>
  );
}
