let workMins = 25;
let workSecs = 0;

let restMins = 5;
let restSecs = 0;

let intervalsElapsed = 0;
let maxIntervals = 4;

let timeLeft = 0;
let startingTime = 0;

let timer = undefined;

const sec_in_ms = 1000;
const min_in_sec = 60;

function startTimer() {
	if (!timer) {
		timer = setInterval(runTimer, sec_in_ms);

		startingTime =
			timeLeft === 0 ? workMins * min_in_sec * sec_in_ms : timeLeft;
		timeLeft = startingTime;

		console.log("Starting timer!");
	}
}

function stopTimer() {
	if (!timer) {
		return;
	}

	clearInterval(timer);
	timer = undefined;
}

function runTimer() {
	timeLeft -= 1000;

	if (timeLeft <= 0) {
		clearInterval(timer);
	} else {
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
			`${(timeLeft / startingTime) * 360}deg`,
		);
	}
}

function pauseTimer() {
	const playPauseButton = document.getElementById("play-pause-icon");

	if (!timer) {
		startTimer();

		playPauseButton.classList.add("fa-pause");
		playPauseButton.classList.remove("fa-play");

		// document.body.style.setProperty("--bg-color", "rgba(200, 35, 42, 1)");
	} else {
		stopTimer();

		playPauseButton.classList.remove("fa-pause");
		playPauseButton.classList.add("fa-play");

		// document.body.style.setProperty("--bg-color", "rgba(115, 3, 8, 1)");
	}
}

function onPausePlayClick() {
	pauseTimer();
}

startTimer();
