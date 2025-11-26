import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListingListViewComponent } from '../listing-list-view/listing-list-view.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ListingListViewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @ViewChild(ListingListViewComponent) listingView!: ListingListViewComponent;
  
  viewMode: 'grid' | 'list' = 'grid';
  
  // Search filters
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedLocation: string = '';

  // Categories list
  categories = [
    { name: 'All Categories', value: '' },
    { name: 'Electronics', value: 'Electronics' },
    { name: 'Home & Garden', value: 'Home & Garden' },
    { name: 'Vehicles', value: 'Vehicles' },
    { name: 'Fashion', value: 'Fashion' },
    { name: 'Sports', value: 'Sports' },
    { name: 'Real Estate', value: 'Real Estate' },
    { name: 'Jobs', value: 'Jobs' },
    { name: 'Services', value: 'Services' },
    { name: 'Other', value: 'Other' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to query params to handle search from header
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
        // Wait for view to be ready, then search
        setTimeout(() => this.onSearch(), 100);
      }
    });
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onSearch(): void {
    if (this.listingView) {
      this.listingView.searchPostads(
        this.searchTerm,
        this.selectedCategory,
        this.selectedLocation
      );
    }
  }

  onCategoryClick(category: string): void {
    this.selectedCategory = category;
    this.onSearch();
  }

  onLocationChange(): void {
    this.onSearch();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedLocation = '';
    if (this.listingView) {
      this.listingView.loadPostads();
    }
  }
}