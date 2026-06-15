import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BrowsingHistoryEntry, DummyUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class BrowsingHistoryService {
  private selectedUserSubject = new BehaviorSubject<DummyUser | null>(null);
  private historySubject = new BehaviorSubject<BrowsingHistoryEntry[]>([]);

  private activeDetailStart: Date | null = null;

  readonly selectedUser$ = this.selectedUserSubject.asObservable();
  readonly history$ = this.historySubject.asObservable();

  openDetail(user: DummyUser): void {
    this.closeActiveDetail(new Date());
    this.selectedUserSubject.next(user);
    this.activeDetailStart = new Date();
  }

  closeDetail(): void {
    this.closeActiveDetail(new Date());
    this.selectedUserSubject.next(null);
    this.activeDetailStart = null;
  }

  reset(): void {
    this.selectedUserSubject.next(null);
    this.historySubject.next([]);
    this.activeDetailStart = null;
  }

  private closeActiveDetail(endTime: Date): void {
    const activeUser = this.selectedUserSubject.value;

    if (!activeUser || !this.activeDetailStart) {
      return;
    }

    const entry: BrowsingHistoryEntry = {
      fullName: `${activeUser.firstName} ${activeUser.lastName}`,
      startTime: this.activeDetailStart,
      endTime,
    };

    this.historySubject.next([...this.historySubject.value, entry]);
  }
}
