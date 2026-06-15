import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { DummyUser } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: 'user-list.component.html',
  imports: [NgFor, NgIf],
})
export class UserListComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private subscriptions: Subscription[] = [];

  @Output() showDetail = new EventEmitter<DummyUser>();

  expandedUserId: number | null = null;
  allUsers: DummyUser[] = [];
  filteredUsers: DummyUser[] = [];
  loggedUser: DummyUser | null = null;
  filterText = '';

  ngOnInit(): void {
    this.subscriptions.push(
      this.userService.getUsers().subscribe((users) => {
        this.allUsers = users;
        this.applyFilter();
      })
    );

    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user) => {
        this.loggedUser = user;
        this.applyFilter();
      })
    );

    this.subscriptions.push(
      this.authService.filterText$.subscribe((value) => {
        this.filterText = value;
        this.applyFilter();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  toggleUserCard(userId: number): void {
    this.expandedUserId = this.expandedUserId === userId ? null : userId;
  }

  onShowDetail(user: DummyUser): void {
    this.showDetail.emit(user);
  }

  clearSelection(): void {
    this.expandedUserId = null;
  }

  private applyFilter(): void {
    const filter = this.filterText.trim().toLowerCase();

    this.filteredUsers = this.allUsers
      .filter((user) => user.id !== this.loggedUser?.id)
      .filter((user) => user.lastName.toLowerCase().includes(filter));
  }
}
