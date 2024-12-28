const workMins = 25;
const workSecs = 30;

const restMins = 5;
const restSecs = 30;

const longRestMins = 15;
const longRestSecs = 30;

let intervalsElapsed = 0;
const maxIntervals = 4;

let timeLeft = 0;
let startingTime = 0;

let timer = undefined;

const sec_in_ms = 1000;
const min_in_sec = 60;

let currentMode = "work";

function setTime(min, sec) {
	startingTime = min * min_in_sec * sec_in_ms + sec * sec_in_ms;
	timeLeft = startingTime;
}

function changeMode() {
	stopTimer();

	if (currentMode === "work") {
		intervalsElapsed++;

		// change border & bg color
		document.body.style.setProperty("--bg-color", "rgba(20, 150, 76, 1)");
		document
			.getElementById("timer-border")
			.style.setProperty("--color", "rgba(30, 30, 30, 1)");

		if (intervalsElapsed === maxIntervals) {
			setTime(longRestMins, longRestSecs);

			document.body.style.setProperty("--bg-color", "rgba(43, 101, 226, 1)");
			document
				.getElementById("timer-border")
				.style.setProperty("--color", "rgba(30, 30, 30, 1)");

			currentMode = "long rest";
		} else {
			setTime(restMins, restSecs);

			currentMode = "rest";
		}
	} else {
    // reset intervals if coming from long break
		if (currentMode === "long rest") {
			intervalsElapsed = 0;
		}

		setTime(workMins, workSecs);

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

	// make interval circles match elapsed intervals
	const intervalCircles = document.querySelectorAll(".timer-circle");
	for (i = 0; i < intervalCircles.length; ++i) {
		const circle = intervalCircles[i];

		if (i < intervalsElapsed) {
			circle.classList.remove("timer-circle-hollow");
			circle.classList.add("timer-circle-full");
		} else {
			circle.classList.add("timer-circle-hollow");
			circle.classList.remove("timer-circle-full");
		}
	}
}

function runTimer() {
	timeLeft -= 1000;

	if (timeLeft <= 0) {
		changeMode();
	} else {
		refreshTimerVisual();
	}
}

function toggleTimerPause() {
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
}

function onPausePlayClick() {
	toggleTimerPause();

	const clickSound = document.getElementById("sfx-click");

	clickSound.play();
}

function onSkipClick() {
	changeMode();

	const clickSound = document.getElementById("sfx-click");

	clickSound.play();
}

setTime(workMins, workSecs);

refreshTimerVisual();

startTimer();
