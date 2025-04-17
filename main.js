/*****
 * SETTING DEFAULTS
*****/

const mainTimerInSeconds = 25 * 60;
const restTimerInSeconds = 5 * 60;
const longBreakInSecods = 20 * 60;

/*****
 * DOM NODES
*****/

// const timerNode = document.querySelector("#timer");
const minutesNode = document.querySelector(".minutes");
const secondsNode = document.querySelector(".seconds");
const btnStart = document.querySelector("#btn-start");
const btnStop = document.querySelector("#btn-stop");


/*****
 * STATE
*****/

let currentCountdown = 0;
let currentTimeStamp = 0;
let RAF;
let cycleNumber = 1;


/*****
 * FUNCTION DECLARATION
*****/

const startTimer = (ts) => {
  currentCountdown = mainTimerInSeconds;
  currentTimeStamp = ts;

  RAF = requestAnimationFrame(runTimer);
}

const runTimer = (newTimestamp) => {
  // newTimestamp - currentTimestamp = delta time (in MS)
  const deltaTimeMS = newTimestamp - currentTimeStamp;
  currentTimeStamp = newTimestamp;
  
  // MS * 0.001 = seconds
  const deltaTimeS = deltaTimeMS * 0.001;
  
  // currentCountdown - DT(s) = time left
  currentCountdown -= deltaTimeS;
  
  // FLOOR (timeleft / 60) = min remaining
  const minRemaining = Math.floor(currentCountdown / 60).toString().padStart(2, "0");
  
  // timeleft % 60 = sec remaining
  const secRemaining = Math.floor(currentCountdown % 60).toString().padStart(2, "0");
  
  // update the DOM
  minutesNode.innerText = minRemaining;
  secondsNode.innerText = secRemaining;

  RAF = requestAnimationFrame(runTimer);
}



/*****
 * EVENT LISTENERS
*****/

btnStart.addEventListener("click", () => requestAnimationFrame(startTimer));
btnStop.addEventListener("click", () => cancelAnimationFrame(RAF));

/*****
 * FUNCTION CALLS
*****/