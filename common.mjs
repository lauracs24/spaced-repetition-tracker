// Convert a UTC date to YYYY-MM-DD.
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// Add calendar months, adjusting for shorter months.
function addMonths(startDate, months) {
  // Use UTC to avoid daylight-saving shifts.
  const date = new Date(`${startDate}T00:00:00Z`);
  const originalDay = date.getUTCDate();

  // Move to day 1 before changing months to avoid overflowing.
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);

  // Day 0 of the following month gives this month's last day.
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  ).getUTCDate();

  date.setUTCDate(Math.min(originalDay, lastDay));

  return formatDate(date);
}

// Export this function so the page and tests can both use it.
export function calculateRevisionDates(startDate) {
  const oneWeekLater = new Date(`${startDate}T00:00:00Z`);
  oneWeekLater.setUTCDate(oneWeekLater.getUTCDate() + 7);

  // Calculate each interval from the original study date.
  return [
    formatDate(oneWeekLater),
    addMonths(startDate, 1),
    addMonths(startDate, 3),
    addMonths(startDate, 6),
    addMonths(startDate, 12),
  ];
}