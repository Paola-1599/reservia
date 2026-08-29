export const toId = (value) => String(value);

export const toDateOnly = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
};

export const toTimeHHMM = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 5);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};
