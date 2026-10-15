import { getData, addData } from "./storage.mjs";
import { calculateRevisionDates } from "./common.mjs";

// Find the elements we need in the HTML.
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

  // Months start at 0, so add 1.
  // padStart adds a leading zero to single-digit numbers.
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Display the selected user's upcoming revisions.
function renderAgenda() {
  // Clear the previous agenda before displaying another one.
  agendaList.replaceChildren();

  const selectedUser = userSelect.value;

  // Wait until a user has been selected.
  if (!selectedUser) {
    agendaMessage.textContent = "Choose a user to see their revision dates.";
    return;
  }

  // Use an empty array if this user has no saved data.
  const revisions = getData(selectedUser) || [];
  const today = getToday();

  const upcomingRevisions = revisions
    // Keep revisions due today or in the future.
    .filter((revision) => revision.date >= today)
    // YYYY-MM-DD strings sort in chronological order.
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcomingRevisions.length === 0) {
    // Distinguish an empty agenda from one with only past revisions.
    agendaMessage.textContent =
      revisions.length === 0
        ? "No revision dates saved for this user."
        : "No upcoming revision dates for this user.";
    return;
  }

  agendaMessage.textContent = `${upcomingRevisions.length} upcoming revision dates.`;

  // Display the topic and date for each revision.
  for (const revision of upcomingRevisions) {
    const listItem = document.createElement("li");
    listItem.textContent = `${revision.topic} — ${revision.date}`;
    agendaList.appendChild(listItem);
  }
}

// Default the date picker to today.
startDateInput.value = getToday();

// Refresh the agenda when a different user is selected.
userSelect.addEventListener("change", renderAgenda);

// Clear any custom validation error when the topic is edited.
topicInput.addEventListener("input", () => {
  topicInput.setCustomValidity("");
});

// Handle submission using either the button or the keyboard.
topicForm.addEventListener("submit", (event) => {
  // Stop the form from reloading the page.
  event.preventDefault();

  const selectedUser = userSelect.value;

  // Remove spaces from the beginning and end of the topic.
  const topic = topicInput.value.trim();
  const startDate = startDateInput.value;

  // A user must be selected before saving a topic.
  if (!selectedUser) {
    agendaMessage.textContent = "Choose a user before adding a topic.";
    userSelect.focus();
    return;
  }

  // Reject a topic containing only spaces.
  topicInput.setCustomValidity(topic ? "" : "Please enter a topic name.");

  // Show validation errors and stop if the form is invalid.
  if (!topicForm.reportValidity()) {
    return;
  }

  // Create one agenda entry for each calculated revision date.
  const newRevisions = calculateRevisionDates(startDate).map((date) => ({
    topic,
    date,
  }));

  // Save the entries for the selected user and refresh their agenda.
  addData(selectedUser, newRevisions);
  renderAgenda();

  // Prepare the topic input for another entry.
  topicInput.value = "";
  topicInput.focus();
});

// Show the initial message when the page loads.
renderAgenda();
