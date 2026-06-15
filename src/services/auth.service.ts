import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Actor } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class SessionManager {
  private activeActorSource = new BehaviorSubject<Actor | null>(null);
  private sessionStartTimeSource = new BehaviorSubject<Date | null>(null);
  private interactionCountSource = new BehaviorSubject<number>(0);
  private searchQuerySource = new BehaviorSubject<string>('');

  activeActor$ = this.activeActorSource.asObservable();
  sessionStartTime$ = this.sessionStartTimeSource.asObservable();
  interactionCount$ = this.interactionCountSource.asObservable();
  searchQuery$ = this.searchQuerySource.asObservable();

  getActiveActor(): Actor | null {
    return this.activeActorSource.value;
  }

  hasActiveSession(): boolean {
    return this.activeActorSource.value !== null;
  }

  initiateSession(actor: Actor): void {
    this.activeActorSource.next(actor);
    this.sessionStartTimeSource.next(new Date());
    this.interactionCountSource.next(0);
    this.searchQuerySource.next('');
  }

  recordInteraction(): void {
    if (!this.hasActiveSession()) return;
    this.interactionCountSource.next(this.interactionCountSource.value + 1);
  }

  updateSearchQuery(query: string): void {
    this.searchQuerySource.next(query);
  }

  terminateSession(): string {
    const startTime = this.sessionStartTimeSource.value;
    const elapsed = startTime
      ? this.calculateElapsedTime(Date.now() - startTime.getTime())
      : '00:00:00';

    this.activeActorSource.next(null);
    this.sessionStartTimeSource.next(null);
    this.interactionCountSource.next(0);
    this.searchQuerySource.next('');

    return elapsed;
  }

  private calculateElapsedTime(ms: number): string {
    const sec = Math.ceil(ms / 1000);
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}
