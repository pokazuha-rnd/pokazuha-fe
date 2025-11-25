import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostadService, PaginatedPostadsDto, PostadListDto } from '../../services/postad.service';

@Component({
  selector: 'app-listing-list-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-list-view.component.html',
  styleUrl: './listing-list-view.component.css'
})
export class ListingListViewComponent implements OnInit {
  postads: PostadListDto[] = [];
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  totalCount = 0;
  loading = false;
  error: string | null = null;
  
  // Expose Math to template
  Math = Math;

  constructor(
    private postadService: PostadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPostads();
  }

  loadPostads(): void {
    this.loading = true;
    this.error = null;

    this.postadService.getActivePostads(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: PaginatedPostadsDto) => {
          console.log('Postads loaded:', response);
          this.postads = response.postads;
          this.currentPage = response.currentPage;
          this.pageSize = response.pageSize;
          this.totalPages = response.totalPages;
          this.totalCount = response.totalCount;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading postads:', err);
          this.error = 'Failed to load postads. Please try again.';
          this.loading = false;
        }
      });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPostads();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewPostad(id: string): void {
    this.router.navigate(['/listing-detail', id]);
  }

  getImageUrl(imageUrl: string): string {
    return this.postadService.getImageUrl(imageUrl);
  }

  get pages(): number[] {
    const maxPagesToShow = 5;
    const pages: number[] = [];
    
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