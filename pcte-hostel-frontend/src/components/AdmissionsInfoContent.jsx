import { CheckCircle2 } from "lucide-react";
import RoomTypeFeeCard from "./RoomTypeFeeCard";
import {
  OVERVIEW,
  COURSE_FEES,
  HOW_TO_APPLY,
  SCHOLARSHIP,
  EDUCATION_LOAN,
  PAY_FEES,
} from "./facilitiesContent";

function PointList({ points }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {points.map((point) => (
        <li key={point} className="flex items-start gap-2.5 text-sm text-slate">
          <CheckCircle2 size={16} className="text-brass mt-0.5 shrink-0" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoCard({ children }) {
  return (
    <div className="bg-white border border-line rounded p-6 max-w-3xl shadow-sm">
      {children}
    </div>
  );
}

export default function AdmissionsInfoContent({ activeTab }) {
  if (activeTab === "overview") {
    return (
      <InfoCard>
        <p className="font-display text-lg text-ink mb-1">Hostel Overview</p>
        <p className="text-sm text-slate leading-relaxed">{OVERVIEW.intro}</p>
        <PointList points={OVERVIEW.points} />
      </InfoCard>
    );
  }

  if (activeTab === "fees") {
    return (
      <InfoCard>
        <p className="font-display text-lg text-ink mb-1">Course Fees & Eligibility</p>
        <p className="text-sm text-slate leading-relaxed">{COURSE_FEES.intro}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted mt-5 mb-1">
          Eligibility for hostel allotment
        </p>
        <PointList points={COURSE_FEES.eligibility} />
        <p className="text-xs text-muted mt-5 border-t border-line pt-4">{COURSE_FEES.note}</p>
      </InfoCard>
    );
  }

  if (activeTab === "how-to-apply") {
    return (
      <InfoCard>
        <p className="font-display text-lg text-ink mb-4">How to Apply for a Room</p>
        <ol className="space-y-4">
          {HOW_TO_APPLY.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="shrink-0 w-7 h-7 rounded-full bg-ink text-brassLight text-xs font-mono font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{step.title}</p>
                <p className="text-sm text-muted mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </InfoCard>
    );
  }

  if (activeTab === "scholarship") {
    return (
      <InfoCard>
        <p className="font-display text-lg text-ink mb-1">Scholarship</p>
        <p className="text-sm text-slate leading-relaxed">{SCHOLARSHIP.intro}</p>
        <PointList points={SCHOLARSHIP.points} />
      </InfoCard>
    );
  }

  if (activeTab === "loan") {
    return (
      <InfoCard>
        <p className="font-display text-lg text-ink mb-1">Education Loan</p>
        <p className="text-sm text-slate leading-relaxed">{EDUCATION_LOAN.intro}</p>
        <PointList points={EDUCATION_LOAN.points} />
      </InfoCard>
    );
  }

  if (activeTab === "pay") {
    return (
      <InfoCard>
        <p className="font-display text-lg text-ink mb-1">Pay Your Fees</p>
        <p className="text-sm text-slate leading-relaxed">{PAY_FEES.intro}</p>
        <PointList points={PAY_FEES.points} />
      </InfoCard>
    );
  }

  // Default / "facilities" tab
  return <RoomTypeFeeCard />;
}
