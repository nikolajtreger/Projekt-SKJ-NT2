import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionRecord, Actor } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class BrowsingHistoryService {
  private selectedActorSubject = new BehaviorSubject<Actor | null>(null);
  private recordsSubject = new BehaviorSubject<SessionRecord[]>([]);

  private activeSessionStart: Date | null = null;

  selectedActor$ = this.selectedActorSubject.asObservable();
  records$ = this.recordsSubject.asObservable();

  openDetail(actor: Actor): void {
    this.finishActiveSession(new Date());
    this.selectedActorSubject.next(actor);
    this.activeSessionStart = new Date();
  }

  closeDetail(): void {
    this.finishActiveSession(new Date());
    this.selectedActorSubject.next(null);
    this.activeSessionStart = null;
  }

  reset(): void {
    this.selectedActorSubject.next(null);
    this.recordsSubject.next([]);
    this.activeSessionStart = null;
  }

  private finishActiveSession(endTime: Date): void {
    const activeActor = this.selectedActorSubject.value;

    if (!activeActor || !this.activeSessionStart) {
      return;
    }

    const record: SessionRecord = {
      actorName: `${activeActor.first} ${activeActor.last}`,
      tIn: this.activeSessionStart,
      tOut: endTime,
    };

    this.recordsSubject.next([...this.recordsSubject.value, record]);
  }
}
