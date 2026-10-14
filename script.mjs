import { getData, addData } from "./storage.mjs";

// Find the elements I need to read from or update.
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

  // JavaScript counts months from 0, so January is 0.
  // Add 1 to get the usual month number.
  const month = String(today.getMonth() + 1).padStart(2, "0");

  // padStart adds a leading zero to single-digit days.
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Convert a UTC date to text and keep the first 10 characters.
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// Add calendar months, adjusting for shorter months.
function addMonths(startDate, months) {
  // Midnight UTC avoids daylight-saving shifts during calculations.
  const date = new Date(`${startDate}T00:00:00Z`);

  // Remember the day before changing the month.
  const originalDay = date.getUTCDate();

  // Start at day 1 so changing months cannot overflow into another month.
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);

  // Day 0 of the following month gives the last day of the target month.
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();

  // Use the original day unless the target month is shorter.
  // For example, January 31 + one month becomes February 28 or 29.
  date.setUTCDate(Math.min(originalDay, lastDay));

  return formatDate(date);
}

// Calculate all five revision dates from the original study date.
function calculateRevisionDates(startDate) {
  const oneWeekLater = new Date(`${startDate}T00:00:00Z`);

  // JavaScript automatically handles crossing into a new month or year.
  oneWeekLater.setUTCDate(oneWeekLater.getUTCDate() + 7);

  // Each interval starts from startDate, not the previous revision date.
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
  // Clear the old list so entries are not duplicated or mixed between users.
  agendaList.replaceChildren();

  const selectedUser = userSelect.value;

  // Do not load an agenda until a user has been selected.
  if (!selectedUser) {
    agendaMessage.textContent = "Choose a user to see their revision dates.";
    return;
  }

  // getData returns null when nothing is saved, so use an empty array instead.
  const revisions = getData(selectedUser) || [];
  const today = getToday();

  const upcomingRevisions = revisions
    // Include today, but hide dates before today.
    .filter((revision) => revision.date >= today)
    // YYYY-MM-DD strings can be compared to put dates in chronological order.
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcomingRevisions.length === 0) {
    // The ? and : choose between two messages.
    // The first is used when no revisions are saved.
    // The second is used when saved revisions are all in the past.
    agendaMessage.textContent =
      revisions.length === 0
        ? "No revision dates saved for this user."
        : "No upcoming revision dates for this user.";

    // Nothing needs to be added to the list.
    return;
  }

  agendaMessage.textContent = `${upcomingRevisions.length} upcoming revision dates.`;

  // Add a separate list item for each revision.
  for (const revision of upcomingRevisions) {
    const listItem = document.createElement("li");

    // textContent displays the topic as plain text.
    listItem.textContent = `${revision.topic} — ${revision.date}`;

    agendaList.appendChild(listItem);
  }
}

// Default to today while still allowing the user to choose another date.
startDateInput.value = getToday();

// Refresh the agenda whenever the selected user changes.
userSelect.addEventListener("change", renderAgenda);

// Remove any custom topic error when the user edits their input.
// An empty string means the input has no custom validation error.
topicInput.addEventListener("input", () => {
  topicInput.setCustomValidity("");
});

// Handle submission through either the button or the keyboard.
topicForm.addEventListener("submit", (event) => {
  // Prevent the browser's normal form submission from reloading the page.
  event.preventDefault();

  const selectedUser = userSelect.value;

  // Remove spaces from the beginning and end of the topic.
  const topic = topicInput.value.trim();
  const startDate = startDateInput.value;

  // Make sure we know which user should receive the new revisions.
  if (!selectedUser) {
    agendaMessage.textContent = "Choose a user before adding a topic.";

    // Move keyboard focus to the dropdown.
    userSelect.focus();
    return;
  }

  // Reject topics containing only spaces, which required alone would allow.
  topicInput.setCustomValidity(topic ? "" : "Please enter a topic name.");

  // Check the form's validation rules and show any browser error message.
  // The HTML's required attributes also check for missing values.
  if (!topicForm.reportValidity()) {
    return;
  }

  // Turn the five dates into five objects containing the topic and date.
  // { topic, date } is shorthand for { topic: topic, date: date }.
  const newRevisions = calculateRevisionDates(startDate).map((date) => ({
    topic,
    date,
  }));

  // Append the new revisions to this user's existing saved data.
  addData(selectedUser, newRevisions);

  // Show the updated agenda immediately after saving.
  renderAgenda();

  // Clear the topic and move focus back so another topic can be added.
  topicInput.value = "";
  topicInput.focus();
});

// Display the initial agenda message when the page loads.
renderAgenda();
