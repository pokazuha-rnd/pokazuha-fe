import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/auth.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userName = '';
  mobileMenuOpen = false;
  searchQuery = '';
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe((user: User | null) => {
      this.isAuthenticated = user !== null;

      if (user) {
        this.userName = `${user.firstName} ${user.lastName}`.trim() || user.email;
      } else {
        this.userName = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
      this.mobileMenuOpen = false;
    }
  }

  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}