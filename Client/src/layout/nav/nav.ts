import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  private router = inject(Router);
  private toast = inject(ToastService);
  protected accountService = inject(AccountService);
  protected creds: any = {};

  login(): void {
    this.accountService.login(this.creds).subscribe({
      next: response => {
        this.router.navigateByUrl('/members');
        this.creds = {};
        this.toast.success("Login successful");
      },
      error: error => {
        this.toast.error(error.error);
      }
    });
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}

