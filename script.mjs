import { getData } from "./storage.mjs";

// Find the date picker on the page.
const startDateInput = document.getElementById("start-date");

// Get today's year, month and day.
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

// Put today's date into the date picker.
startDateInput.value = year + "-" + month + "-" + day;

// Find the user dropdown and message paragraph.
const userSelect = document.getElementById("user");
const agendaMessage = document.getElementById("agenda-message");

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
