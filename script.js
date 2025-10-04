// Get all the needed DOM Elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count =0;
const maxCount = 50;

// Handle form subbmission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;
  console.log(name, teamName);


  // increment count
  count++;
  // Update attendee count in UI
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;
  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;
  console.log(`Progress: ${percentage}`);

  // Up the team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Show personalized greeting message
  const greeting = document.getElementById("greeting");
  greeting.textContent = `🎉 Welcome, ${name} from ${teamName}!`;

  form.reset();
});