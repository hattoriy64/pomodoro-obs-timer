export type Phase = "work" | "break";

export interface TimerState {
  phase: Phase;
  remainingSeconds: number;
  isRunning: boolean;
  completedSets: number;
  workMinutes: number;
  breakMinutes: number;
}

export type OnTickCallback = (state: TimerState) => void;
export type OnPhaseChangeCallback = (phase: Phase) => void;

export class PomodoroTimer {
  private state: TimerState;
  private intervalId: number | null = null;
  private onTick: OnTickCallback;
  private onPhaseChange: OnPhaseChangeCallback;

  constructor(
    workMinutes: number,
    breakMinutes: number,
    onTick: OnTickCallback,
    onPhaseChange: OnPhaseChangeCallback
  ) {
    this.onTick = onTick;
    this.onPhaseChange = onPhaseChange;
    this.state = {
      phase: "work",
      remainingSeconds: workMinutes * 60,
      isRunning: false,
      completedSets: 0,
      workMinutes,
      breakMinutes,
    };
  }

  getState(): Readonly<TimerState> {
    return { ...this.state };
  }

  start(): void {
    if (this.state.isRunning) return;
    this.state.isRunning = true;
    this.intervalId = window.setInterval(() => this.tick(), 1000);
    this.onTick(this.getState());
  }

  pause(): void {
    if (!this.state.isRunning) return;
    this.state.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.onTick(this.getState());
  }

  reset(): void {
    this.pause();
    this.state.phase = "work";
    this.state.remainingSeconds = this.state.workMinutes * 60;
    this.state.isRunning = false;
    this.onTick(this.getState());
  }

  resetSets(): void {
    this.state.completedSets = 0;
    this.onTick(this.getState());
  }

  setWorkMinutes(minutes: number): void {
    const clamped = Math.min(120, Math.max(1, minutes));
    this.state.workMinutes = clamped;
    if (this.state.phase === "work" && !this.state.isRunning) {
      this.state.remainingSeconds = clamped * 60;
    }
    this.onTick(this.getState());
  }

  setBreakMinutes(minutes: number): void {
    const clamped = Math.min(120, Math.max(1, minutes));
    this.state.breakMinutes = clamped;
    if (this.state.phase === "break" && !this.state.isRunning) {
      this.state.remainingSeconds = clamped * 60;
    }
    this.onTick(this.getState());
  }

  private tick(): void {
    this.state.remainingSeconds -= 1;

    if (this.state.remainingSeconds <= 0) {
      this.switchPhase();
      return;
    }

    this.onTick(this.getState());
  }

  private switchPhase(): void {
    if (this.state.phase === "work") {
      this.state.phase = "break";
      this.state.remainingSeconds = this.state.breakMinutes * 60;
      this.onPhaseChange("break");
    } else {
      this.state.completedSets += 1;
      this.state.phase = "work";
      this.state.remainingSeconds = this.state.workMinutes * 60;
      this.onPhaseChange("work");
    }
    this.onTick(this.getState());
  }

  static formatTime(seconds: number): string {
    const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  }
}
