

const CycleType = Object.freeze({
  NONE: 0,
  MAIN_TIMER: 1, // WORK 🖥️ : ${cycleNumber+1}
  REST_TIMER: 2, // COFFEE ☕️ : ${cycleNumber+1}
  BREAK_TIMER: 3 // HOME 😴 : ${cycleNumber+1}
});

const CycleEmoji = Object.freeze(["", "🖥️", "☕️", "😴"]);


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


const checkCycle = (pom) => {
  // cd <= 0 ? move on to rest/restart main
  if (pom[currentCountdown] > 0) { return; }
  
  if (pom[currentCycle] === CycleType.MAIN_TIMER) {
    pom[currentCycle] = CycleType.REST_TIMER;
    pom[currentCountdown] = pom[restTimerInSeconds];
    pom[currentCountdownTruncated] = pom[restTimerInSeconds];
  } else if (pom[currentCycle] === CycleType.REST_TIMER) {
    pom[cycleNumber] += 1;
    pom[currentCycle] = pom[cycleNumber] == 4 ? CycleType.BREAK_TIMER : CycleType.MAIN_TIMER;
    pom[currentCountdown] = pom[cycleNumber] == 4 ? pom[longBreakInSeconds] : pom[mainTimerInSeconds];
    pom[currentCountdownTruncated] = pom[currentCountdown];
  } else if (pom[currentCycle] === CycleType.BREAK_TIMER) {
    pom[currentCycle] = CycleType.MAIN_TIMER;
    pom[currentCountdown] = pom[mainTimerInSeconds];
    pom[currentCountdownTruncated] = pom[mainTimerInSeconds];
    pom[cycleNumber] = 0;
  }
}


function pause() {
  if (!this[started]) { return; }
  this[paused] = true;
  cancelAnimationFrame(this[RAF]);
  this[RAF] = requestAnimationFrame((ts) => this[runTimer](ts));
}


function start(newTimestamp = 0) {
  if (!this[started]) {
    this[started] = true;
    this[currentCountdown] = this[mainTimerInSeconds];
    this[currentCountdownTruncated] = this[mainTimerInSeconds];
    this[currentCycle] = CycleType.MAIN_TIMER;
    this[RAF] = requestAnimationFrame((ts) => this.start(ts));
    return;
  }
  
  this[currentTimeStamp] = newTimestamp;
  this[paused] = false;

  cancelAnimationFrame(this[RAF]);
  this[RAF] = requestAnimationFrame((ts) => this[runTimer](ts));
}

function stop() {
  this[started] = false;
  this[paused] = false;
  cancelAnimationFrame(this[RAF]);
}


function RunTimer(newTimestamp) {
  // newTimestamp - currentTimestamp = delta time (in MS)
  const deltaTimeMS = newTimestamp - this[currentTimeStamp];
  this[currentTimeStamp] = newTimestamp;

  console.log(`DT: ${deltaTimeMS} and current timestamp: ${this[currentTimeStamp]}`);
  cancelAnimationFrame(this[RAF]);
  this[RAF] = requestAnimationFrame((ts) => this[runTimer](ts));
  
  if (this[paused] || !this[started]) { return; }
  
  // MS * 0.001 = seconds
  const deltaTimeS = deltaTimeMS * 0.001;
  
  // currentCountdown - DT(s) = time left
  this[currentCountdown] -= deltaTimeS;
  const newTruncated = Math.floor(this[currentCountdown]);
  // checkCycle(this);

  if (newTruncated === this[currentCountdownTruncated]) { return; }

  // FLOOR (timeleft / 60) = min remaining
  const minRemaining = Math.floor(this[currentCountdown] / 60).toString().padStart(2, "0");
  
  // timeleft % 60 = sec remaining
  const secRemaining = Math.floor(this[currentCountdown] % 60).toString().padStart(2, "0");
  
  this[currentCountdownTruncated] = newTruncated;

  this[eventTarget].dispatchEvent(new CustomEvent("timeChange", {detail: [minRemaining, secRemaining]}) )
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

function onTimeChange(fn) {
  this[eventTarget].addEventListener("timeChange", fn);
}

function onCycleChange(fn) {
  this[eventTarget].addEventListener("cycleChange", fn);
}

function Pomodoro() {
  if (new.target === undefined) { throw new TypeError("Must call `Pomodoro` with new keyword.") };
  this[currentCountdown] = 0;
  this[currentCountdownTruncated] = 0;
  this[currentTimeStamp] = 0;
  this[RAF] = undefined;
  this[currentCycle] = CycleType.MAIN_TIMER;
  this[cycleNumber] = 1;
  this[paused] = false;
  this[started] = false;
  this[mainTimerInSeconds] = 25 * 60;
  this[restTimerInSeconds] =  5 * 60;
  this[longBreakInSeconds] = 10 * 60;
  this[eventTarget] = new EventTarget();
  this[runTimer] = RunTimer;
}


Object.setPrototypeOf(Pomodoro.prototype, { start, stop, pause, setMainTimer, setRestTimer, setBreakTimer, onTimeChange });

export { CycleType, Pomodoro }