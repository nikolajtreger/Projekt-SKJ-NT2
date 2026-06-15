import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { UserListComponent } from '../user-list/user-list.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { HistoryPanelComponent } from '../history/history.component';
import { SessionManager } from '../../services/auth.service';
import { BrowsingHistoryService } from '../../services/browsing-history.service';
import { Actor } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  imports: [TopBarComponent, UserListComponent, UserDetailComponent, HistoryPanelComponent],
})
export class MainViewComponent implements OnInit, OnDestroy {
  private sessionMgr = inject(SessionManager);
  private histSvc = inject(BrowsingHistoryService);
  private router = inject(Router);
  private subs: Subscription[] = [];

  currentActor: Actor | null = null;
  sessionStart: Date | null = null;
  clicks = 0;
  query = '';
  openedActor: Actor | null = null;

  ngOnInit(): void {
    this.subs.push(
      this.sessionMgr.activeActor$.subscribe((act) => {
        this.currentActor = act;
      })
    );

    this.subs.push(
      this.sessionMgr.sessionStartTime$.subscribe((ts) => {
        this.sessionStart = ts;
      })
    );

    this.subs.push(
      this.sessionMgr.interactionCount$.subscribe((cnt) => {
        this.clicks = cnt;
      })
    );

    this.subs.push(
      this.sessionMgr.searchQuery$.subscribe((q) => {
        this.query = q;
      })
    );

    this.subs.push(
      this.histSvc.selectedActor$.subscribe((act) => {
        this.openedActor = act;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  onPageInteraction(): void {
    this.sessionMgr.recordInteraction();
  }

  onQueryChange(q: string): void {
    this.sessionMgr.updateSearchQuery(q);
  }

  onActorSelected(act: Actor): void {
    this.histSvc.openDetail(act);
  }

  onActorDeselected(): void {
    this.histSvc.closeDetail();
  }

  onLogout(): void {
    this.histSvc.closeDetail();
    const duration = this.sessionMgr.terminateSession();
    this.histSvc.reset();

    window.alert(`Session duration: ${duration}`);
    this.router.navigate(['/login']);
  }
}
