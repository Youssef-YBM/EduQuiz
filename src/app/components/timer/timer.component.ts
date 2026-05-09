import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],  // 👈 AJOUTER CETTE LIGNE
  templateUrl: './timer.html',
  styleUrls: ['./timer.css']
})

export class TimerComponent implements OnInit, OnDestroy {
  @Input() initialSeconds = 300;
  @Output() timeUp = new EventEmitter<void>();
  
  timeLeft: number;
  private interval: any;
  
  constructor() {
    this.timeLeft = this.initialSeconds;
  }
  
  ngOnInit(): void {
    this.startTimer();
  }
  
  ngOnDestroy(): void {
    this.stopTimer();
  }
  
  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
        this.timeUp.emit();
      }
    }, 1000);
  }
  
  stopTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  
  getFormattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  getProgressPercentage(): number {
    return (this.timeLeft / this.initialSeconds) * 100;
  }
}