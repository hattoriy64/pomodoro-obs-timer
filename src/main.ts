import { PomodoroTimer, Phase, TimerState } from "./timer.js";

const phaseLabel = document.getElementById("phase-label") as HTMLElement;
const timeDisplay = document.getElementById("time-display") as HTMLElement;
const setsDisplay = document.getElementById("sets-display") as HTMLElement;

const startBtn = document.getElementById("btn-start") as HTMLButtonElement;
const pauseBtn = document.getElementById("btn-pause") as HTMLButtonElement;
const resetBtn = document.getElementById("btn-reset") as HTMLButtonElement;
const resetSetsBtn = document.getElementById("btn-reset-sets") as HTMLButtonElement;

const workInput = document.getElementById("work-minutes") as HTMLInputElement;
const breakInput = document.getElementById("break-minutes") as HTMLInputElement;

const PHASE_LABELS: Record<Phase, string> = {
  work: "作業中",
  break: "休憩中",
};

function render(state: TimerState): void {
  phaseLabel.textContent = PHASE_LABELS[state.phase];
  phaseLabel.dataset["phase"] = state.phase;

  timeDisplay.textContent = PomodoroTimer.formatTime(state.remainingSeconds);
  timeDisplay.dataset["phase"] = state.phase;

  setsDisplay.textContent = `${state.completedSets} セット完了`;

  startBtn.disabled = state.isRunning;
  pauseBtn.disabled = !state.isRunning;

  document.body.dataset["phase"] = state.phase;
}

function onPhaseChange(phase: Phase): void {
  document.body.dataset["phase"] = phase;
}

const timer = new PomodoroTimer(
  parseInt(workInput.value, 10),
  parseInt(breakInput.value, 10),
  render,
  onPhaseChange
);

render(timer.getState());

startBtn.addEventListener("click", () => timer.start());
pauseBtn.addEventListener("click", () => timer.pause());
resetBtn.addEventListener("click", () => timer.reset());
resetSetsBtn.addEventListener("click", () => timer.resetSets());

workInput.addEventListener("change", () => {
  const val = parseInt(workInput.value, 10);
  if (!isNaN(val)) timer.setWorkMinutes(val);
});

breakInput.addEventListener("change", () => {
  const val = parseInt(breakInput.value, 10);
  if (!isNaN(val)) timer.setBreakMinutes(val);
});
