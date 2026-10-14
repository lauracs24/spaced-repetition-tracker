import { getData } from "./storage.mjs";

const userSelect = document.getElementById("user");
const topicForm = document.getElementById("topic-form");
const topicInput = document.getElementById("topic");
const startDateInput = document.getElementById("start-date");
const agendaMessage = document.getElementById("agenda-message");
const agendaList = document.getElementById("agenda-list");

// Get today's local date in YYYY-MM-DD format.
function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Convert a UTC date to YYYY-MM-DD.
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// Add calendar months, adjusting for shorter months.
function addMonths(startDate, months) {
  const date = new Date(`${startDate}T00:00:00Z`);
  const originalDay = date.getUTCDate();

  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);

  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  ).getUTCDate();

  date.setUTCDate(Math.min(originalDay, lastDay));

  return formatDate(date);
}

// Calculate all five dates from the original study date.
function calculateRevisionDates(startDate) {
  const oneWeekLater = new Date(`${startDate}T00:00:00Z`);
  oneWeekLater.setUTCDate(oneWeekLater.getUTCDate() + 7);

  return [
    formatDate(oneWeekLater),
    addMonths(startDate, 1),
    addMonths(startDate, 3),
    addMonths(startDate, 6),
    addMonths(startDate, 12),
  ];
}

// Display the selected user's upcoming revisions.
function renderAgenda() {
  agendaList.replaceChildren();

  const selectedUser = userSelect.value;

  if (!selectedUser) {
    agendaMessage.textContent =
      "Choose a user to see their revision dates.";
    return;
  }

  const revisions = getData(selectedUser) || [];
  const today = getToday();

  const upcomingRevisions = revisions
    .filter((revision) => revision.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcomingRevisions.length === 0) {
    agendaMessage.textContent =
      revisions.length === 0
        ? "No revision dates saved for this user."
        : "No upcoming revision dates for this user.";
    return;
  }

  agendaMessage.textContent =
    `${upcomingRevisions.length} upcoming revision dates.`;

  for (const revision of upcomingRevisions) {
    const listItem = document.createElement("li");
    listItem.textContent = `${revision.topic} — ${revision.date}`;
    agendaList.appendChild(listItem);
  }
}
