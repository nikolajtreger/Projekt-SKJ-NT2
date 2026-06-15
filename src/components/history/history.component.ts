import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { SessionRecord } from '../../models/user.model';
import { BrowsingHistoryService } from '../../services/browsing-history.service';

@Component({
  selector: 'app-history-panel',
  templateUrl: 'history.component.html',
  imports: [DatePipe, NgFor, NgIf],
})
export class HistoryPanelComponent implements OnInit, OnDestroy {
  private historySvc = inject(BrowsingHistoryService);
  private historySub?: Subscription;

  records: SessionRecord[] = [];

  ngOnInit(): void {
    this.historySub = this.historySvc.records$.subscribe((val) => {
      this.records = val;
    });
  }

  ngOnDestroy(): void {
    this.historySub?.unsubscribe();
  }
}
