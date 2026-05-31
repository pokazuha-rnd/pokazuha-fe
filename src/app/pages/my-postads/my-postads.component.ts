import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PostadService, PostadListDto, PaginatedPostadsDto } from '../../services/postad.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-postads',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-postads.component.html',
  styleUrl: './my-postads.component.css'
})
export class MyPostadsComponent implements OnInit {
  postads: PostadListDto[] = [];
  isLoading = false;
  errorMessage = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 0;
  hasPreviousPage = false;
  hasNextPage = false;

  constructor(
    private postadService: PostadService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loadMyPostads();
  }

  loadMyPostads(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.postadService.getMyPostads(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedPostadsDto) => {
        this.postads = response.postads;
        this.currentPage = response.currentPage;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.hasPreviousPage = response.hasPreviousPage;
        this.hasNextPage = response.hasNextPage;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading my postads:', error);
        this.errorMessage = 'Failed to load your postads. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMyPostads();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onEdit(postadId: string): void {
    // Navigate to edit page (to be implemented)
    this.router.navigate(['/post', postadId, 'edit']);
  }

  onDelete(postadId: string): void {
    if (!confirm('Are you sure you want to delete this ad?')) {
      return;
    }

    this.postadService.deletePostad(postadId).subscribe({
      next: () => {
        // Reload the list after deletion
        this.loadMyPostads();
      },
      error: (error) => {
        console.error('Error deleting postad:', error);
        alert('Failed to delete the ad. Please try again.');
      }
    });
  }

  getImageUrl(imageUrl: string): string {
    return this.postadService.getImageUrl(imageUrl);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}