import { useState } from "react";
import { X, CreditCard, CheckCircle2, ShieldCheck, QrCode, Building, Loader2 } from "lucide-react";

export default function PaymentModal({ isOpen, onClose, student, roomTypeFee, onPaymentSuccess }) {
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  if (!isOpen) return null;

  const installmentAmount = roomTypeFee?.installment1?.fan || "₹60,000";
  const installmentLabel = "1st Installment (Room Confirmation)";

  function handlePay() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      const receipt = onPaymentSuccess({
        amount: installmentAmount,
        installment: installmentLabel,
        method: method.toUpperCase(),
      });
      setReceiptData(receipt);
    }, 1200);
  }

  function handleDone() {
    setSuccess(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkdeep/70 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-line shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper">
          <div>
            <p className="text-xs uppercase tracking-widest text-brass font-mono">Hostel Fee Payment</p>
            <h3 className="font-display text-lg text-ink">
              {success ? "Payment Successful" : "Complete Fee Payment"}
            </h3>
          </div>
          <button onClick={onClose} className="text-muted hover:text-slate p-1 rounded">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-confirmed/10 text-confirmed flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <p className="font-display text-xl text-ink">Payment Received!</p>
              <p className="text-sm text-muted mt-1">
                Your 1st installment payment of <span className="font-semibold text-slate">{installmentAmount}</span> has been confirmed.
              </p>
            </div>

            <div className="bg-paper border border-line rounded p-4 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-muted">Transaction ID:</span>
                <span className="text-ink font-semibold">{receiptData?.txnId || "PCTE-847291"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Student:</span>
                <span className="text-slate">{student?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">College ID:</span>
                <span className="text-slate">{student?.collegeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Payment Mode:</span>
                <span className="text-slate">{method.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status:</span>
                <span className="text-confirmed font-semibold">ALLOTMENT CONFIRMED</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full bg-ink text-white py-2.5 rounded text-sm font-medium hover:bg-inkdeep transition-colors"
            >
              Done & View Allotment Card
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="bg-paper border border-line rounded p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-mono">{installmentLabel}</p>
                <p className="text-xs text-muted mt-0.5">PCTE Session 2026–27</p>
              </div>
              <span className="font-mono text-2xl font-bold text-ink">{installmentAmount}</span>
            </div>

            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod("upi")}
                  className={`p-3 rounded border text-center transition-colors flex flex-col items-center gap-1.5 ${
                    method === "upi" ? "border-brass bg-brass/5 text-ink font-semibold" : "border-line text-muted hover:border-slate/40"
                  }`}
                >
                  <QrCode size={18} className={method === "upi" ? "text-brass" : "text-muted"} />
                  <span className="text-xs">UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`p-3 rounded border text-center transition-colors flex flex-col items-center gap-1.5 ${
                    method === "card" ? "border-brass bg-brass/5 text-ink font-semibold" : "border-line text-muted hover:border-slate/40"
                  }`}
                >
                  <CreditCard size={18} className={method === "card" ? "text-brass" : "text-muted"} />
                  <span className="text-xs">Debit / Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("netbanking")}
                  className={`p-3 rounded border text-center transition-colors flex flex-col items-center gap-1.5 ${
                    method === "netbanking" ? "border-brass bg-brass/5 text-ink font-semibold" : "border-line text-muted hover:border-slate/40"
                  }`}
                >
                  <Building size={18} className={method === "netbanking" ? "text-brass" : "text-muted"} />
                  <span className="text-xs">Net Banking</span>
                </button>
              </div>
            </div>

            {method === "upi" && (
              <div className="border border-line rounded p-4 bg-paper/50 text-center space-y-2">
                <div className="w-28 h-28 bg-white border border-line rounded mx-auto flex items-center justify-center p-2 shadow-xs">
                  <div className="w-full h-full bg-slate/10 rounded flex items-center justify-center text-[10px] text-muted font-mono">
                    [MOCK UPI QR]
                  </div>
                </div>
                <p className="text-xs text-muted">Scan with Google Pay, PhonePe, or Paytm</p>
                <p className="text-xs font-mono text-slate">pcte-hostels@sbi</p>
              </div>
            )}

            {method === "card" && (
              <div className="space-y-3">
                <input
                  placeholder="Card number (4000 1234 5678 9010)"
                  defaultValue="4532 •••• •••• 8821"
                  className="w-full border border-line rounded px-3 py-2 text-sm font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="MM / YY" defaultValue="08/29" className="border border-line rounded px-3 py-2 text-sm font-mono" />
                  <input placeholder="CVV" defaultValue="•••" type="password" className="border border-line rounded px-3 py-2 text-sm font-mono" />
                </div>
              </div>
            )}

            {method === "netbanking" && (
              <select className="w-full border border-line rounded px-3 py-2 text-sm bg-white">
                <option>State Bank of India</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Punjab National Bank</option>
              </select>
            )}

            <div className="flex items-center gap-2 text-xs text-muted">
              <ShieldCheck size={14} className="text-confirmed" />
              <span>256-bit encrypted simulation. Instant allotment hold.</span>
            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full bg-brass text-white py-2.5 rounded text-sm font-medium hover:bg-brassLight transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing Payment…
                </>
              ) : (
                `Pay ${installmentAmount} Now`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
