// Get all the needed DOM Elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50;

// Load counts from localStorage
function loadCounts() {
  const savedCount = localStorage.getItem("attendanceCount");
  const savedWater = localStorage.getItem("waterCount");
  const savedZero = localStorage.getItem("zeroCount");
  const savedPower = localStorage.getItem("powerCount");
  count = savedCount ? parseInt(savedCount) : 0;
  document.getElementById("attendeeCount").textContent = count;
  document.getElementById("waterCount").textContent = savedWater
    ? savedWater
    : "0";
  document.getElementById("zeroCount").textContent = savedZero
    ? savedZero
    : "0";
  document.getElementById("powerCount").textContent = savedPower
    ? savedPower
    : "0";
  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  document.getElementById("progressBar").style.width = percentage;

  // Load attendee lists for each team
  const waterList = document.getElementById("waterAttendees");
  const zeroList = document.getElementById("zeroAttendees");
  const powerList = document.getElementById("powerAttendees");
  waterList.innerHTML = "";
  zeroList.innerHTML = "";
  powerList.innerHTML = "";
  const savedAttendees = localStorage.getItem("attendeeList");
  if (savedAttendees) {
    const attendees = JSON.parse(savedAttendees);
    attendees.forEach(function(att) {
      const li = document.createElement("li");
      li.textContent = att.name;
      li.className = `attendee-item ${att.team}`;
      if (att.team === "water") {
        waterList.appendChild(li);
      } else if (att.team === "zero") {
        zeroList.appendChild(li);
      } else if (att.team === "power") {
        powerList.appendChild(li);
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", loadCounts);
// Ensure greeting message is always visible, even before check-in
document.getElementById("greeting").textContent = "Welcome! Please check in below.";

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

  // Save counts to localStorage
  localStorage.setItem("attendanceCount", count);
  localStorage.setItem(
    "waterCount",
    document.getElementById("waterCount").textContent
  );
  localStorage.setItem(
    "zeroCount",
    document.getElementById("zeroCount").textContent
  );
  localStorage.setItem(
    "powerCount",
    document.getElementById("powerCount").textContent
  );

  // Save attendee to localStorage
  let attendees = [];
  const savedAttendees = localStorage.getItem("attendeeList");
  if (savedAttendees) {
    attendees = JSON.parse(savedAttendees);
  }
  attendees.push({ name: name, team: team, teamName: teamName });
  localStorage.setItem("attendeeList", JSON.stringify(attendees));

  // Update attendee list in UI for the correct team
  const li = document.createElement("li");
  li.textContent = name;
  li.className = `attendee-item ${team}`;
  if (team === "water") {
    document.getElementById("waterAttendees").appendChild(li);
  } else if (team === "zero") {
    document.getElementById("zeroAttendees").appendChild(li);
  } else if (team === "power") {
    document.getElementById("powerAttendees").appendChild(li);
  }

  // Check if attendee goal is reached
  if (count >= maxCount) {
    // Find the winning team
    const waterCount = parseInt(document.getElementById("waterCount").textContent);
    const zeroCount = parseInt(document.getElementById("zeroCount").textContent);
    const powerCount = parseInt(document.getElementById("powerCount").textContent);
    let winningTeam = "";
    let winningEmoji = "";
    if (waterCount >= zeroCount && waterCount >= powerCount) {
      winningTeam = "Team Water Wise";
      winningEmoji = "🌊";
    } else if (zeroCount >= waterCount && zeroCount >= powerCount) {
      winningTeam = "Team Net Zero";
      winningEmoji = "🌿";
    } else {
      winningTeam = "Team Renewables";
      winningEmoji = "⚡";
    }
    const greeting = document.getElementById("greeting");
    greeting.classList.add("hide");
    setTimeout(function () {
      greeting.textContent = `🏆 Celebration! ${winningEmoji} ${winningTeam} has the most check-ins!`;
      greeting.classList.remove("hide");
    }, 100);
    form.reset();
    return;
  }

  // Show personalized greeting message and console message in greeting area
  const greeting = document.getElementById("greeting");
  const consoleMsg = `Console: Checked in ${name} to ${teamName}. Total: ${count}`;
  greeting.innerHTML = `<span>🎉 Welcome, ${name} from ${teamName}!</span><br><span style='font-size:0.95em;color:#555;'>${consoleMsg}</span>`;
  greeting.style.opacity = "1";

  form.reset();
});
