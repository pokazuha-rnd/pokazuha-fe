import { Component, OnInit, Input } from '@angular/core';
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
  @Input() viewMode: 'grid' | 'list' = 'grid';
  
  postads: PostadListDto[] = [];
  currentPage = 1;
  pageSize = 12;
  totalPages = 0;
  totalCount = 0;
  loading = false;
  loadingMore = false;
  error: string | null = null;

  constructor(
    private postadService: PostadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPostads();
  }

  get hasMorePages(): boolean {
    return this.currentPage < this.totalPages;
  }

  loadPostads(): void {
    this.loading = true;
    this.error = null;
    this.currentPage = 1;

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
          this.error = 'Failed to load listings. Please try again.';
          this.loading = false;
        }
      });
  }

  loadMore(): void {
    if (this.loadingMore || !this.hasMorePages) return;
    
    this.loadingMore = true;
    const nextPage = this.currentPage + 1;

    this.postadService.getActivePostads(nextPage, this.pageSize)
      .subscribe({
        next: (response: PaginatedPostadsDto) => {
          this.postads = [...this.postads, ...response.postads];
          this.currentPage = response.currentPage;
          this.totalPages = response.totalPages;
          this.totalCount = response.totalCount;
          this.loadingMore = false;
        },
        error: (err) => {
          console.error('Error loading more postads:', err);
          this.loadingMore = false;
        }
      });
  }

  searchPostads(searchTerm?: string, category?: string, location?: string): void {
    this.loading = true;
    this.error = null;
    this.currentPage = 1;

    // If no filters, load all
    if (!searchTerm && !category && !location) {
      this.loadPostads();
      return;
    }

    this.postadService.searchPostads(
      searchTerm || undefined,
      category || undefined,
      location || undefined,
      undefined,
      undefined,
      undefined,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response: PaginatedPostadsDto) => {
        console.log('Search results:', response);
        this.postads = response.postads;
        this.currentPage = response.currentPage;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error searching postads:', err);
        this.error = 'Failed to search listings. Please try again.';
        this.loading = false;
      }
    });
  }

  viewPostad(id: string): void {
    this.router.navigate(['/listing', id]);
  }

  getImageUrl(imageUrl: string): string {
    return this.postadService.getImageUrl(imageUrl);
  }
}