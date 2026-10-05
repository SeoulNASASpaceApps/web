const KST_TIME_ZONE = "Asia/Seoul";

const kstDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: KST_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getKstDateString(date = new Date()): string {
  const parts = kstDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) return "";
  return `${year}-${month}-${day}`;
}

export function getCalendarDayDifference(fromDate: string, toDate: string): number {
  const toUtcDay = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };

  return Math.round((toUtcDay(toDate) - toUtcDay(fromDate)) / 86_400_000);
}
