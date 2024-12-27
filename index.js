const workMins = 25;
const workSecs = 0;

const restMins = 5;
const restSecs = 0;

let intervalsElapsed = 0;
const maxIntervals = 4;

let timeLeft = 0;
let startingTime = 0;

let timer = undefined;

const sec_in_ms = 1000;
const min_in_sec = 60;

let currentMode = "work";

function changeMode() {
  stopTimer();

  if (currentMode === "work") {
    intervalsElapsed++;

    // make interval circles reflect elapsed intervals
    const intervalCircles = document.querySelectorAll(".timer-circle");
    for (i = 0; i < intervalsElapsed; ++i) {
      const circle = intervalCircles[i];

      circle.classList.remove("timer-circle-hollow");
      circle.classList.add("timer-circle-full");
    }

    // change border & bg color
    document.body.style.setProperty("--bg-color", "rgba(20, 150, 76, 1)");
    document
      .getElementById("timer-border")
      .style.setProperty("--color", "rgba(30, 30, 30, 1)");

    if (intervalsElapsed === maxIntervals) {
      startingTime = 0;
      timeLeft = 0;

      document.body.style.setProperty("--bg-color", "rgba(241, 224, 56, 1)");
      document
        .getElementById("timer-border")
        .style.setProperty("--color", "rgba(30, 30, 30, 1)");

      currentMode = "end";
    } else {
      startingTime = restMins * min_in_sec * sec_in_ms;
      timeLeft = startingTime;

      currentMode = "rest";
    }
  } else {
    startingTime = workMins * min_in_sec * sec_in_ms;
    timeLeft = startingTime;

    document.body.style.setProperty("--bg-color", "rgba(200, 35, 42, 1)");
    document
      .getElementById("timer-border")
      .style.setProperty("--color", "rgba(20, 150, 76, 1)");

    currentMode = "work";
  }

  refreshTimerVisual();

  const statusText = document.getElementById("timer-status-text");
  statusText.innerHTML = currentMode;

  if (currentMode !== "end") {
    startTimer();
  }
}

function startTimer() {
  if (timer) {
    return;
  }

  timer = setInterval(runTimer, sec_in_ms);

  console.log("Starting timer!");
}

function stopTimer() {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = undefined;

  console.log("Stopping timer!");
}

function refreshTimerVisual() {
  // update timer text
  const timeText = document.getElementById("timer-time-text");

  const minsLeft = Math.trunc(timeLeft / (sec_in_ms * min_in_sec));
  const secsLeft = (timeLeft % (sec_in_ms * min_in_sec)) / sec_in_ms;

  const formattedSecs = `${secsLeft}`.padStart(2, "0");

  timeText.innerHTML = `${minsLeft}:${formattedSecs}`;

  // update radial timer indicator
  const timerBorder = document.getElementById("timer-border");

  timerBorder.style.setProperty(
    "--angle",
    `${timeLeft > 0 ? (timeLeft / startingTime) * 360 : 360}deg`,
  );
}

function runTimer() {
  timeLeft -= 1000;

  if (timeLeft <= 0) {
    clearInterval(timer);
  } else {
    refreshTimerVisual();
  }
}

function pauseTimer() {
  const playPauseButton = document.getElementById("play-pause-icon");

  if (!timer) {
    startTimer();

    playPauseButton.classList.add("fa-pause");
    playPauseButton.classList.remove("fa-play");
  } else {
    stopTimer();

    playPauseButton.classList.remove("fa-pause");
    playPauseButton.classList.add("fa-play");
  }

  const clickSound = document.getElementById("sfx-click");

  clickSound.play();
}

function onPausePlayClick() {
  pauseTimer();
}

function onSkipClick() {
  changeMode();
}

startingTime = workMins * min_in_sec * sec_in_ms;
timeLeft = startingTime;

startTimer();
