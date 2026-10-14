// Find the date picker on the page.

const StartDateInput = document.getElementById("start-date");

// Get today's year, month and day.

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

// Put today's date into the date picker.

startDateInput.value = year + "-" + month + "-" + day;