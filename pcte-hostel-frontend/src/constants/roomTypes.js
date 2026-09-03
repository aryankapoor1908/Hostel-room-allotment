// Illustrative fee figures — 3-Seater is the real published PCTE figure.
// 2-Seater and 1-Seater are placeholder estimates set lower than the
// 3-Seater rate per project owner's request.
export const ROOM_TYPES = [
  {
    key: "3-seater",
    label: "3 Seater",
    fee: { fan: "₹110,000", ac: "₹118,800" },
    installment1: { fan: "₹60,000", ac: "₹64,400" },
    installment2: { fan: "₹50,000", ac: "₹54,400" },
    availableBoys: true,
    availableGirls: true,
  },
  {
    key: "2-seater",
    label: "2 Seater",
    fee: { fan: "₹95,000", ac: "₹102,000" },
    installment1: { fan: "₹50,000", ac: "₹54,000" },
    installment2: { fan: "₹45,000", ac: "₹48,000" },
    availableBoys: true,
    availableGirls: true,
  },
  {
    key: "2-seater-washroom",
    label: "2 Seater (Only for boys with attached washroom)",
    fee: { fan: "₹98,000", ac: "₹105,000" },
    installment1: { fan: "₹52,000", ac: "₹55,000" },
    installment2: { fan: "₹46,000", ac: "₹50,000" },
    availableBoys: true,
    availableGirls: false,
  },
  {
    key: "1-seater",
    label: "1 Seater",
    fee: { fan: "₹80,000", ac: "₹86,000" },
    installment1: { fan: "₹42,000", ac: "₹45,000" },
    installment2: { fan: "₹38,000", ac: "₹41,000" },
    availableBoys: true,
    availableGirls: true,
  },
];
