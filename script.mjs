import { getData } from "./storage.mjs";

const userSelect = document.getElementById("user");
const topicForm = document.getElementById("topic-form");
const topicInput = document.getElementById("topic");
const startDateInput = document.getElementById("start-date");
const agendaMessage = document.getElementById("agenda-message");
const agendaList = document.getElementById("agenda-list");

// Find the date picker.
const startDateInput = document.getElementById("start-date");

// Get today's year, month and day.
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

// Show today's date in the date picker.
startDateInput.value = year + "-" + month + "-" + day;

// Find the dropdown, message, form and topic input.
const userSelect = document.getElementById("user");
const agendaMessage = document.getElementById("agenda-message");
const topicForm = document.getElementById("topic-form");
const topicInput = document.getElementById("topic");

// Check saved dates when someone chooses a user.
userSelect.addEventListener("change", () => {
  const selectedUser = userSelect.value;
  const revisions = getData(selectedUser) || [];

  if (revisions.length === 0) {
    agendaMessage.textContent = "No revision dates saved for this user.";
  } else {
    agendaMessage.textContent = revisions.length + " saved revision dates.";
  }
});