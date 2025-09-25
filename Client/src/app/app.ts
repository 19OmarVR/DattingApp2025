import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Nav } from "../layout/nav/nav";
import { AccountService } from '../core/services/account-service';
import { Home } from "../features/home/home";
import { Register } from '../features/account/register/register';

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private accountService = inject(AccountService);
  private http = inject(HttpClient);
  protected readonly title = signal('Datting App 2025');
  protected members = signal<any>([]);

  async ngOnInit(): Promise<void> {
    this.setCurrentUser();
    this.members.set(await this.getMembers());
  }

  setCurrentUser(): void {
    const userString = localStorage.getItem("user");
    if (!userString) return;
    const user = JSON.parse(userString!);
    this.accountService.currentUser.set(user);
  }


  async getMembers(): Promise<Object> {
    try {
      return lastValueFrom(this.http.get('https://localhost:5001/api/members'))
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
