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

		startingTime = workMins * min_in_sec * sec_in_ms;
		timeLeft = startingTime;

		console.log("Starting timer!");
	}
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

		timeText.innerHTML = `${minsLeft}:${secsLeft}`;

		// update radial timer indicator
		const timerBorder = document.getElementById("timer-border");

		timerBorder.style.setProperty("--angle", `${(timeLeft / startingTime) * 360}deg`);
	}
}

startTimer();
