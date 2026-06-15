import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { UserListComponent } from '../user-list/user-list.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { HistoryPanelComponent } from '../history/history.component';
import { AuthService } from '../../services/auth.service';
import { BrowsingHistoryService } from '../../services/browsing-history.service';
import { DummyUser } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  imports: [TopBarComponent, UserListComponent, UserDetailComponent, HistoryPanelComponent],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly browsingHistoryService = inject(BrowsingHistoryService);
  private readonly router = inject(Router);
  private subscriptions: Subscription[] = [];

  currentUser: DummyUser | null = null;
  loginAt: Date | null = null;
  clickCount = 0;
  filterText = '';
  selectedUser: DummyUser | null = null;

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
      })
    );

    this.subscriptions.push(
      this.authService.loginAt$.subscribe((value) => {
        this.loginAt = value;
      })
    );

    this.subscriptions.push(
      this.authService.clickCount$.subscribe((value) => {
        this.clickCount = value;
      })
    );

    this.subscriptions.push(
      this.authService.filterText$.subscribe((value) => {
        this.filterText = value;
      })
    );

    this.subscriptions.push(
      this.browsingHistoryService.selectedUser$.subscribe((user) => {
        this.selectedUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onAnyAppClick(): void {
    this.authService.registerClick();
  }

  onFilterChange(value: string): void {
    this.authService.setFilterText(value);
  }

  onShowDetail(user: DummyUser): void {
    this.browsingHistoryService.openDetail(user);
  }

  onCloseDetail(): void {
    this.browsingHistoryService.closeDetail();
  }

  logout(): void {
    this.browsingHistoryService.closeDetail();
    const duration = this.authService.logout();
    this.browsingHistoryService.reset();

    window.alert(`Dlzka prihlasenia: ${duration}`);
    this.router.navigate(['/login']);
  }
}
