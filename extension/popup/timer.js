// Useful constants for time calculations
const ms_in_sec = 1000;
const sec_in_min = 60;

let workMins = 25;
let workSecs = 0;

let restMins = 5;
let restSecs = 0;

let longRestMins = 15;
let longRestSecs = 0;

let paused = false;

let targetIntervals = 4;
let intervalsLeft = targetIntervals;

let targetTime = 0;
let timeLeft = 0;

let streak = 0;

let mode = "work";
let activeInterval = undefined;

const playPauseButton = document.querySelector('button[type="play-pause"]');

playPauseButton.addEventListener("click", () => {
	const playPauseIcon = playPauseButton.getElementsByTagName("i")[0];

	if (paused) {
		playPauseIcon.classList.remove("fa-play");
		playPauseIcon.classList.add("fa-pause");

		beginInterval();

		paused = false;
	} else {
		playPauseIcon.classList.remove("fa-pause");
		playPauseIcon.classList.add("fa-play");

		stopInterval();

		paused = true;
	}
});

const skipButton = document.querySelector('button[type="skip"]');

skipButton.addEventListener("click", () => {
	advance();
});

const restartButton = document.querySelector('button[type="restart"]');

restartButton.addEventListener("click", () => {
  stopInterval();

	// Reset streak and intervals and force switch to work mode
	streak = 0;
	intervalsLeft = targetIntervals;

	// Ensure all bg coloring is cleared
	document.body.classList.remove("green-bg");
	document.body.classList.remove("blue-bg");

	document.body.classList.add("red-bg");

	const timerCircle = document.getElementById("timer-circle-bg");
	timerCircle.style.setProperty("--color", "#13964c");

	mode = "work";

  refreshStreakVisualizers();
  setTime();
  refreshTimeVisualizers();
  beginInterval();
});

// Start the timer
function setTime() {
	if (mode === "work") {
		targetTime = workSecs * ms_in_sec + workMins * sec_in_min * ms_in_sec;
	} else if (mode === "rest") {
		targetTime = restSecs * ms_in_sec + restMins * sec_in_min * ms_in_sec;
	} else {
		targetTime =
			longRestSecs * ms_in_sec + longRestMins * sec_in_min * ms_in_sec;
	}

	timeLeft = targetTime;
}

function advance() {
	stopInterval();
	changeMode();
	refreshStreakVisualizers();
	setTime();
	refreshTimeVisualizers();
	beginInterval();
}

function onTimerTick() {
	timeLeft -= ms_in_sec;

	if (timeLeft <= 0) {
		advance();
	} else {
		refreshTimeVisualizers();
	}
}

function beginInterval() {
	activeInterval = setInterval(() => {
		onTimerTick();
	}, ms_in_sec);
}

function stopInterval() {
	clearInterval(activeInterval);
}

function changeMode() {
	const timerCircle = document.getElementById("timer-circle-bg");

	if (mode === "work") {
		intervalsLeft -= 1;

		document.body.classList.remove("red-bg");

		timerCircle.style.setProperty("--color", "#1b1b1b");

		if (intervalsLeft <= 0) {
			document.body.classList.add("blue-bg");

			mode = "long rest";
		} else {
			document.body.classList.add("green-bg");

			mode = "rest";
		}
	} else {
		// Ensure all bg coloring is cleared
		document.body.classList.remove("green-bg");
		document.body.classList.remove("blue-bg");

		document.body.classList.add("red-bg");

		timerCircle.style.setProperty("--color", "#13964c");

		// If came from long rest, reset intervals and update streak
		if (mode === "long rest") {
			intervalsLeft = targetIntervals;
			streak++;
		}

		mode = "work";
	}
}

function refreshTimeVisualizers() {
	// Convert time left from ms to mins and sec first
	// TODO: Ensure these are optimally mathed out!
	let minsLeft = Math.trunc(timeLeft / sec_in_min / ms_in_sec);
	let secsLeft = (timeLeft % (minsLeft * sec_in_min * ms_in_sec)) / ms_in_sec;

	minsLeft = `${minsLeft}`.padStart(2, "0");
	secsLeft = `${secsLeft}`.padStart(2, "0");

	// Update timer text
	const timerText = document.getElementById("timer-text");

	timerText.innerHTML = `${minsLeft}:${secsLeft}`;

	// Update timer circle
	const degrees = (timeLeft / targetTime) * 360;

	const timerCircle = document.getElementById("timer-circle-bg");
	timerCircle.style.setProperty("--angle", `${degrees}deg`);
}

function refreshStreakVisualizers() {
	// Fill interval circles as represented by state
	const intervalsElapsed = targetIntervals - intervalsLeft;

	const intervalCircles = document.getElementsByClassName("ic");
	for (i = 0; i < intervalCircles.length; ++i) {
		if (i < intervalsElapsed) {
			intervalCircles[i].classList.remove("interval-circle-hollow");
			intervalCircles[i].classList.add("interval-circle-full");
		} else {
			intervalCircles[i].classList.remove("interval-circle-full");
			intervalCircles[i].classList.add("interval-circle-hollow");
		}
	}

	// Update streak number
	const streakNumber = document.getElementById("streak-text");

	streakNumber.innerHTML = `${streak}`;
}

setTime();
beginInterval();
