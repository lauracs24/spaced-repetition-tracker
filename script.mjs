import { getData } from "./storage.mjs";

// Find the dropdown, form, inputs, message and agenda list in the HTML.
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

  // Months start at 0, so add 1. Add a leading zero where needed.
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Convert a UTC date to a string and keep only the YYYY-MM-DD part.
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// Add calendar months, adjusting for shorter months.
function addMonths(startDate, months) {
  // Use midnight UTC so daylight-saving changes do not affect calculations.
  const date = new Date(`${startDate}T00:00:00Z`);
  const originalDay = date.getUTCDate();

  // Move to day 1 before changing months to avoid overflowing into another month.
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);

  // Day 0 of the following month is the last day of the target month.
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();

  // Restore the original day, or use the last day if this month is shorter.
  date.setUTCDate(Math.min(originalDay, lastDay));

  return formatDate(date);
}

// Calculate all five dates from the original study date.
function calculateRevisionDates(startDate) {
  // Add seven calendar days to get the first revision date.
  const oneWeekLater = new Date(`${startDate}T00:00:00Z`);
  oneWeekLater.setUTCDate(oneWeekLater.getUTCDate() + 7);

  // Return dates for one week, one month, three months, six months and one year.
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
  // Remove the previously displayed list items before showing the new agenda.
  agendaList.replaceChildren();

  // Read the selected user's ID from the dropdown.
  const selectedUser = userSelect.value;

  // If no user is selected, ask the user to choose one.
  if (!selectedUser) {
    agendaMessage.textContent = "Choose a user to see their revision dates.";

    // Stop here because we need a user before loading their agenda.
    return;
  }

  // Load this user's saved revisions, or use an empty array if none exist.
  const revisions = getData(selectedUser) || [];

  // Get today's date so we can check which revisions are still due.
  const today = getToday();

  const upcomingRevisions = revisions
    // Keep revisions due today or in the future.
    .filter((revision) => revision.date >= today)
    // Sort from earliest to latest. YYYY-MM-DD strings sort in date order.
    .sort((a, b) => a.date.localeCompare(b.date));

  // If there are no revisions due today or in the future, show a message.
  if (upcomingRevisions.length === 0) {
    // Choose the message based on whether any revisions were ever saved.
    agendaMessage.textContent =
      revisions.length === 0
        ? "No revision dates saved for this user."
        : "No upcoming revision dates for this user.";

    // Stop here because there are no upcoming revisions to display.
    return;
  }

  // Show how many upcoming revision dates the selected user has.
  agendaMessage.textContent = `${upcomingRevisions.length} upcoming revision dates.`;

  // Create one list item for each upcoming revision.
  for (const revision of upcomingRevisions) {
    const listItem = document.createElement("li");

    // Put the topic name and revision date inside the list item.
    listItem.textContent = `${revision.topic} — ${revision.date}`;

    // Add the completed item to the agenda list on the page.
    agendaList.appendChild(listItem);
  }
}

// Set the date picker to today.
startDateInput.value = getToday();

// Show the relevant agenda when a user is selected.
userSelect.addEventListener("change", renderAgenda);

// Clear the topic validation message when typing.
topicInput.addEventListener("input", () => {
  topicInput.setCustomValidity("");
});

// Save the topic's revision dates when the form is submitted.
topicForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedUser = userSelect.value;
  const topic = topicInput.value.trim();
  const startDate = startDateInput.value;

  if (!selectedUser) {
    agendaMessage.textContent = "Choose a user before adding a topic.";
    userSelect.focus();
    return;
  }

  topicInput.setCustomValidity(topic ? "" : "Please enter a topic name.");

  if (!topicForm.reportValidity()) {
    return;
  }

  const newRevisions = calculateRevisionDates(startDate).map((date) => ({
    topic,
    date,
  }));

  addData(selectedUser, newRevisions);
  renderAgenda();

  topicInput.value = "";
  topicInput.focus();
});

// Show the initial message on page load.
renderAgenda();
