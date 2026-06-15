import { Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { DummyUser } from '../../models/user.model';
import {
  EnrichedUserData,
  UserDetailService,
} from '../../services/user-detail.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: 'user-detail.component.html',
  imports: [NgIf],
})
export class UserDetailComponent implements OnDestroy {
  private readonly userDetailService = inject(UserDetailService);
  private detailSubscription?: Subscription;

  @Output() closeDetail = new EventEmitter<void>();

  @Input() set selectedUser(value: DummyUser | null) {
    this.user = value;
    this.enrichedData = null;

    if (!value) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.loadEnrichedData(value);
  }

  user: DummyUser | null = null;
  loading = false;
  enrichedData: EnrichedUserData | null = null;

  close(): void {
    this.closeDetail.emit();
  }

  ngOnDestroy(): void {
    this.detailSubscription?.unsubscribe();
  }

  private loadEnrichedData(user: DummyUser): void {
    this.detailSubscription?.unsubscribe();

    this.detailSubscription = this.userDetailService
      .getEnrichedUserData(user)
      .subscribe({
        next: (data) => {
          this.enrichedData = data;
          this.loading = false;
        },
        error: () => {
          this.enrichedData = {
            testGender: 'Nedostupne',
            homeState: 'Nedostupne',
          };
          this.loading = false;
        },
      });
  }
}
