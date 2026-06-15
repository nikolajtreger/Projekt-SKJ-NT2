import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { BrowsingHistoryEntry } from '../../models/user.model';
import { BrowsingHistoryService } from '../../services/browsing-history.service';

@Component({
  selector: 'app-history-panel',
  templateUrl: 'history.component.html',
  imports: [DatePipe, NgFor, NgIf],
})
export class HistoryPanelComponent implements OnInit, OnDestroy {
  private readonly browsingHistoryService = inject(BrowsingHistoryService);
  private historySubscription?: Subscription;

  history: BrowsingHistoryEntry[] = [];

  ngOnInit(): void {
    this.historySubscription = this.browsingHistoryService.history$.subscribe((value) => {
      this.history = value;
    });
  }

  ngOnDestroy(): void {
    this.historySubscription?.unsubscribe();
  }
}
