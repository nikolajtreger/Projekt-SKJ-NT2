import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DummyUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<DummyUser | null>(null);
  private loginAtSubject = new BehaviorSubject<Date | null>(null);
  private clickCountSubject = new BehaviorSubject<number>(0);
  private filterTextSubject = new BehaviorSubject<string>('');

  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly loginAt$ = this.loginAtSubject.asObservable();
  readonly clickCount$ = this.clickCountSubject.asObservable();
  readonly filterText$ = this.filterTextSubject.asObservable();

  getCurrentUser(): DummyUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  login(user: DummyUser): void {
    this.currentUserSubject.next(user);
    this.loginAtSubject.next(new Date());
    this.clickCountSubject.next(0);
    this.filterTextSubject.next('');
  }

  registerClick(): void {
    if (!this.isLoggedIn()) {
      return;
    }

    this.clickCountSubject.next(this.clickCountSubject.value + 1);
  }

  setFilterText(value: string): void {
    this.filterTextSubject.next(value);
  }

  logout(): string {
    const loginAt = this.loginAtSubject.value;
    const duration = loginAt
      ? this.formatDuration(Date.now() - loginAt.getTime())
      : '00:00:00';

    this.currentUserSubject.next(null);
    this.loginAtSubject.next(null);
    this.clickCountSubject.next(0);
    this.filterTextSubject.next('');

    return duration;
  }

  private formatDuration(milliseconds: number): string {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
