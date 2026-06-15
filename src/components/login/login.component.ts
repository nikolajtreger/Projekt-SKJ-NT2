import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  imports: [FormsModule, NgIf],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  firstName = '';
  lastName = '';
  errorMessage = '';
  loading = false;

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/app']);
    }
  }

  submitLogin(): void {
    const normalizedFirstName = this.firstName.trim();
    const normalizedLastName = this.lastName.trim();

    if (!normalizedFirstName || !normalizedLastName) {
      this.errorMessage = 'Vypln meno aj priezvisko.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.userService.findLoginMatch(normalizedFirstName, normalizedLastName).subscribe({
      next: (user) => {
        this.loading = false;

        if (!user) {
          this.errorMessage = 'Pouzivatel sa nenasiel. Skontroluj meno a priezvisko.';
          return;
        }

        this.authService.login(user);
        this.router.navigate(['/app']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Nepodarilo sa nacitat zoznam pouzivatelov.';
      },
    });
  }
}
