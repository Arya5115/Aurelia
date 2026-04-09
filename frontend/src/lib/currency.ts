const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrCompactFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatInrAmount(value: string | number) {
  const amount = typeof value === "string" ? Number(value) : value;
  return inrFormatter.format(Number.isFinite(amount) ? amount : 0);
}

export function formatInrCompact(value: string | number) {
  const amount = typeof value === "string" ? Number(value) : value;
  return inrCompactFormatter.format(Number.isFinite(amount) ? amount : 0);
}
