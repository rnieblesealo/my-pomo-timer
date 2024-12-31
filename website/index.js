let workMins = 25;
let workSecs = 0;

let restMins = 5;
let restSecs = 0;

let longRestMins = 15;
let longRestSecs = 0;

let intervalsElapsed = 0;
const maxIntervals = 4;

let intervalStreak = 0;

let timeLeft = 0;
let startingTime = 0;

let timer = undefined;

const sec_in_ms = 1000;
const min_in_sec = 60;

let currentMode = "work";

let settingsMenuShown = false;

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
		// reset intervals and increase streak if coming from long break
		if (currentMode === "long rest") {
			intervalsElapsed = 0;
			intervalStreak++;
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

	// update streak text
	const streakElement = document.getElementById("streak");

	if (intervalStreak > 0) {
		streakElement.classList.remove("hidden");
	} else {
		streakElement.classList.add("hidden");
	}

	const streakText = document.getElementById("streak-text");
	streakText.innerHTML = `${intervalStreak}`;

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

function playClickSound() {
	const clickSound = document.getElementById("sfx-click");
	clickSound.play();
}

function onPausePlayClick() {
	toggleTimerPause();
	playClickSound();
}

function onSkipClick() {
	changeMode();
	playClickSound();
}

function applySettings() {
	// get input fields
	const workInputs = Array.from(
		document
			.getElementById("work-inputs")
			.querySelectorAll('input[type="text"]'),
	);
	const restInputs = Array.from(
		document
			.getElementById("rest-inputs")
			.querySelectorAll('input[type="text"]'),
	);
	const longRestInputs = Array.from(
		document
			.getElementById("long-rest-inputs")
			.querySelectorAll('input[type="text"]'),
	);

	// reassign times from input vals
	workMins = Number.parseInt(`${workInputs[0].value}${workInputs[1].value}`);
	workSecs = Number.parseInt(`${workInputs[2].value}${workInputs[3].value}`);

	restMins = Number.parseInt(`${restInputs[0].value}${restInputs[1].value}`);
	restSecs = Number.parseInt(`${restInputs[2].value}${restInputs[3].value}`);

	longRestMins = Number.parseInt(
		`${longRestInputs[0].value}${longRestInputs[1].value}`,
	);
	longRestSecs = Number.parseInt(
		`${longRestInputs[2].value}${longRestInputs[3].value}`,
	);

	playClickSound();
}

function resetSettings() {
	// get input fields
	const workInputs = Array.from(
		document
			.getElementById("work-inputs")
			.querySelectorAll('input[type="text"]'),
	);
	const restInputs = Array.from(
		document
			.getElementById("rest-inputs")
			.querySelectorAll('input[type="text"]'),
	);
	const longRestInputs = Array.from(
		document
			.getElementById("long-rest-inputs")
			.querySelectorAll('input[type="text"]'),
	);

	// set defaults on input fields
	workInputs[0].value = "2";
	workInputs[1].value = "5";
	workInputs[2].value = "0";
	workInputs[3].value = "0";

	restInputs[0].value = "0";
	restInputs[1].value = "5";
	restInputs[2].value = "0";
	restInputs[3].value = "0";

	longRestInputs[0].value = "1";
	longRestInputs[1].value = "5";
	longRestInputs[2].value = "0";
	longRestInputs[3].value = "0";

	// set defaults on actual vals
	workMins = 25;
	workSecs = 0;

	restMins = 5;
	restSecs = 0;

	longRestMins = 15;
	longRestSecs = 0;

	playClickSound();
}

setTime(workMins, workSecs);

refreshTimerVisual();

startTimer();

const settingsButton = document.getElementById("settings");

settingsButton.addEventListener("mousedown", () => {
	const settingsMenu = document.getElementById("settings-menu");

	if (!settingsMenuShown) {
		settingsMenu.classList.remove("menu-hidden");
		settingsMenu.classList.add("menu-shown");
	} else {
		settingsMenu.classList.remove("menu-shown");
		settingsMenu.classList.add("menu-hidden");
	}

	settingsMenuShown = !settingsMenuShown;

	playClickSound();
});
