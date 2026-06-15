import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionManager } from '../../services/auth.service';
import { PrincipalDataService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  imports: [FormsModule, NgIf],
})
export class AuthenticationComponent {
  private sessionMgr = inject(SessionManager);
  private principalService = inject(PrincipalDataService);
  private nav = inject(Router);

  fname = '';
  lname = '';
  msg = '';
  busy = false;

  ngOnInit(): void {
    if (this.sessionMgr.hasActiveSession()) {
      this.nav.navigate(['/app']);
    }
  }

  performLogin(): void {
    const trimmedFname = this.fname.trim();
    const trimmedLname = this.lname.trim();

    if (!trimmedFname || !trimmedLname) {
      this.msg = 'Please enter both first and last name.';
      return;
    }

    this.busy = true;
    this.msg = '';

    this.principalService.verifyCredentials(trimmedFname, trimmedLname).subscribe({
      next: (actor) => {
        this.busy = false;

        if (!actor) {
          this.msg = 'Actor not found in system. Check credentials.';
          return;
        }

        this.sessionMgr.initiateSession(actor);
        this.nav.navigate(['/app']);
      },
      error: () => {
        this.busy = false;
        this.msg = 'Failed to fetch actor database.';
      },
    });
  }
}
