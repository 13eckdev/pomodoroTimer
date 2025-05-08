

const CycleType = Object.freeze({
  NONE: 0,
  MAIN_TIMER: 1, // WORK 🖥️ : ${cycleNumber+1}
  REST_TIMER: 2, // COFFEE ☕️ : ${cycleNumber+1}
  BREAK_TIMER: 3 // HOME 😴 : ${cycleNumber+1}
});


/*****
 * PRIVATE MEMEBERS
 *****/

const currentCountdown = Symbol("currentCountdown");
const currentCountdownTruncated = Symbol("currentCountdownTruncated");
const currentTimeStamp = Symbol("currentTimeStamp");
const RAF = Symbol("RAF");
const currentCycle = Symbol("currentCycle");
const cycleNumber = Symbol("cycleNumber");
const paused = Symbol("paused");
const started = Symbol("started");
const mainTimerInSeconds = Symbol("mainTimerInSeconds");
const restTimerInSeconds = Symbol("restTimerInSeconds");
const longBreakInSeconds = Symbol("longBreakInSeconds");
const eventTarget = Symbol("eventTarget");
const startTimer = Symbol("startTimer");
const runTimer = Symbol("runTimer");

function StartTimer(newTimestamp) {
  this[started] = true;
  this[currentCountdown] = mainTimerInSeconds;
  this[currentCountdownTruncated] = mainTimerInSeconds;
  this[currentTimeStamp] = newTimestamp;
  this[currentCycle] = CycleType.MAIN_TIMER;
  
  this[RAF] = requestAnimationFrame((ts) => this[runTimer](ts));
}


function start() {
  this[RAF] = requestAnimationFrame((ts) => this[startTimer](ts));
}

function stop() {
  cancelAnimationFrame(this[RAF]);
}


function RunTimer(newTimestamp) {
  
}

function setMainTimer(min) {
  this[mainTimerInSeconds] = min * 60;
}

function setRestTimer(min) {
  this[restTimerInSeconds] = min * 60;
}

function setBreakTimer(min) {
  this[longBreakInSeconds] = min * 60;
}

function Pomodoro() {
  if (new.target === undefined) { throw new TypeError("Must call `Pomodoro` with new keyword.") };
  this[currentCountdown] = 0;
  this[currentCountdownTruncated] = 0;
  this[currentTimeStamp] = 0;
  this[RAF] = undefined;
  this[currentCycle] = 1;
  this[cycleNumber] = 1;
  this[paused] = false;
  this[started] = false;
  this[mainTimerInSeconds] = 25 * 60;
  this[restTimerInSeconds] =  5 * 60;
  this[longBreakInSeconds] = 10 * 60;
  this[eventTarget] = new EventTarget();
  this[startTimer] = StartTimer;
  this[runTimer] = RunTimer;
}


Object.setPrototypeOf(Pomodoro.prototype, { start, stop, setMainTimer, setRestTimer, setBreakTimer });

export { CycleType, Pomodoro }