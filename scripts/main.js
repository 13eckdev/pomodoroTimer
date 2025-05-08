import { CycleType, Pomodoro } from "./pomodoro.js";

/*****
 * SETTING DEFAULTS
*****/

// const mainTimerInSeconds = 25 * 60;
// const restTimerInSeconds = 5 * 60;
// const longBreakInSeconds = 10 * 60;

const pom = new Pomodoro();
pom.start();


/*****
 * DOM NODES
*****/

const timerNode = document.querySelector("#timer");
const minutesNode = document.querySelector(".minutes");
const secondsNode = document.querySelector(".seconds");
const btnStart = document.querySelector("#btn-start");
const btnStop = document.querySelector("#btn-stop");


/*****
 * FUNCTION DECLARATION
*****/

const toggleStartButton = () => {
  btnStart.innerText = paused ? "Pause" : "Continue";
  paused = !paused;
}


// const startTimer = (newTimestamp) => {
//   started = true;
//   currentCountdown = mainTimerInSeconds;
//   currentCountdownTruncated = mainTimerInSeconds;
//   currentTimeStamp = newTimestamp;
//   btnStart.innerText = "Pause";
//   currentCycle = CycleType.MAIN_TIMER;

//   RAF = requestAnimationFrame(runTimer);
// }


const runTimer = (newTimestamp) => {
  // newTimestamp - currentTimestamp = delta time (in MS)
  const deltaTimeMS = newTimestamp - currentTimeStamp;
  currentTimeStamp = newTimestamp;

  RAF = requestAnimationFrame(runTimer);
  
  if (paused) { return; }
  
  // MS * 0.001 = seconds
  const deltaTimeS = deltaTimeMS * 0.001;
  
  // currentCountdown - DT(s) = time left
  currentCountdown -= deltaTimeS;
  const newTruncated = Math.floor(currentCountdown);
  checkCycle(currentCountdown);

  if (newTruncated === currentCountdownTruncated) { return; }

  // FLOOR (timeleft / 60) = min remaining
  const minRemaining = Math.floor(currentCountdown / 60).toString().padStart(2, "0");
  
  // timeleft % 60 = sec remaining
  const secRemaining = Math.floor(currentCountdown % 60).toString().padStart(2, "0");
  
  // update the DOM
  minutesNode.innerText = minRemaining;
  secondsNode.innerText = secRemaining;
  currentCountdownTruncated = newTruncated;
}

const checkCycle = (countdown) => {
  // dt <= 0 ? move on to rest/restart main
  if (countdown > 0) { return; }
  
  if (currentCycle === CycleType.MAIN_TIMER) {
    currentCycle = CycleType.REST_TIMER;
    currentCountdown = restTimerInSeconds;
    currentCountdownTruncated = restTimerInSeconds;
  } else if (currentCycle === CycleType.REST_TIMER) {
    cycleNumber += 1;
    currentCycle = cycleNumber == 4 ? CycleType.BREAK_TIMER : CycleType.MAIN_TIMER;
    currentCountdown = cycleNumber == 4 ? longBreakInSeconds : mainTimerInSeconds;
    currentCountdownTruncated = currentCountdown;
  } else if (currentCycle === CycleType.BREAK_TIMER) {
    currentCycle = CycleType.MAIN_TIMER;
    currentCountdown = mainTimerInSeconds;
    currentCountdownTruncated = mainTimerInSeconds;
    cycleNumber = 0;
  }
}


/*****
 * EVENT LISTENERS
*****/

btnStart.addEventListener("click", () => {
  if (started) {
    toggleStartButton();
  } else {
    requestAnimationFrame(startTimer)
  }
});


btnStop.addEventListener("click", () => {
  cancelAnimationFrame(RAF);
  paused = false;
  started = false;
  minutesNode.innerText = "25";
  secondsNode.innerText = "00";
  btnStart.innerText = "Start";
});

/*****
 * FUNCTION CALLS
*****/