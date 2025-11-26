import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostadService, PostadDto } from '../../services/postad.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listing-detail.component.html'
})
export class ListingDetailComponent implements OnInit {
  listing?: PostadDto;
  selectedImage: string = '';
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private postadService: PostadService
  ) {}

  ngOnInit() {
    const listingId = this.route.snapshot.paramMap.get('id');
    
    if (listingId) {
      this.loadListing(listingId);
    } else {
      this.error = 'Listing ID not found';
      this.loading = false;
    }
  }

  loadListing(id: string): void {
    this.loading = true;
    this.error = null;

    this.postadService.getPostadById(id).subscribe({
      next: (postad) => {
        this.listing = postad;
        // Set the first image as selected
        if (postad.images && postad.images.length > 0) {
          this.selectedImage = this.getImageUrl(postad.images[0].imageUrl);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading listing:', err);
        this.error = 'Failed to load listing. Please try again.';
        this.loading = false;
      }
    });
  }

  selectImage(imageUrl: string) {
    this.selectedImage = this.getImageUrl(imageUrl);
  }

  getImageUrl(imageUrl: string): string {
    return this.postadService.getImageUrl(imageUrl);
  }
}