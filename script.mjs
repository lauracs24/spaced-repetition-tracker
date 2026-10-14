// Find the date picker on the page.
const startDateInput = document.getElementById("start-date");

// Get today's year, month and day.
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

// Put today's date into the date picker.
startDateInput.value = year + "-" + month + "-" + day;

const userSelect = document.getElementById("user");
const agendaMessage = document.getElementById("agenda-message");

// Update the message when someone chooses a user.
userSelect.addEventListener("change", () => {
  agendaMessage.textContent = "User " + userSelect.value + " selected.";
});
