import { Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { Actor } from '../../models/user.model';
import {
  DetailedProfile,
  UserDetailService,
} from '../../services/user-detail.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: 'user-detail.component.html',
  imports: [NgIf],
})
export class ProfileViewComponent implements OnDestroy {
  private profileSvc = inject(UserDetailService);
  private detailSub?: Subscription;

  @Output() deselected = new EventEmitter<void>();

  @Input() set selectedActor(value: Actor | null) {
    this.actor = value;
    this.profile = null;

    if (!value) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.loadProfile(value);
  }

  actor: Actor | null = null;
  isLoading = false;
  profile: DetailedProfile | null = null;

  dismiss(): void {
    this.deselected.emit();
  }

  ngOnDestroy(): void {
    this.detailSub?.unsubscribe();
  }

  private loadProfile(actor: Actor): void {
    this.detailSub?.unsubscribe();

    this.detailSub = this.profileSvc
      .getDetailedProfile(actor)
      .subscribe({
        next: (data) => {
          this.profile = data;
          this.isLoading = false;
        },
        error: () => {
          this.profile = {
            detectedGender: 'N/A',
            residenceState: 'N/A',
          };
          this.isLoading = false;
        },
      });
  }
}
