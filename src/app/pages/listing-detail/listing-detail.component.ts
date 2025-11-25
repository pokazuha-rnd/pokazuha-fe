import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  brand: string;
  category: string;
  location: string;
  images: string[];
  createdAt: Date;
  seller: {
    name: string;
    memberSince: Date;
  };
}

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listing-detail.component.html'
})
export class ListingDetailComponent implements OnInit {
  listing?: Listing;
  selectedImage: string = '';
  similarListings: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // TODO: Get listing ID from route and fetch from API
    const listingId = this.route.snapshot.paramMap.get('id');
    
    // Mock data for now
    this.listing = {
      id: '1',
      title: 'iPhone 13 Pro - 256GB - Excellent Condition',
      description: `Selling my iPhone 13 Pro in excellent condition. The phone has been used for 8 months and is in pristine condition with no scratches or dents.

Specifications:
- 256GB storage
- Sierra Blue color
- Battery health: 95%
- Face ID working perfectly
- All original accessories included
- Original box and receipt included

The phone has always been used with a case and screen protector. Selling because I upgraded to a newer model.

Price is firm. No trades please.

Feel free to contact me for more details or to schedule a viewing.`,
      price: 2500,
      condition: 'Like New',
      brand: 'Apple',
      category: 'Electronics > Phones',
      location: 'Bucharest, Sector 1',
      images: [
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400/0000FF',
        'https://via.placeholder.com/600x400/FF0000',
        'https://via.placeholder.com/600x400/00FF00'
      ],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      seller: {
        name: 'John Doe',
        memberSince: new Date(2023, 5, 15)
      }
    };

    this.selectedImage = this.listing.images[0];

    // Mock similar listings
    this.similarListings = [
      {
        image: 'https://via.placeholder.com/300x200',
        price: 2300,
        title: 'iPhone 13 - 128GB',
        location: 'Bucharest'
      },
      {
        image: 'https://via.placeholder.com/300x200',
        price: 2800,
        title: 'iPhone 13 Pro Max - 256GB',
        location: 'Cluj-Napoca'
      },
      {
        image: 'https://via.placeholder.com/300x200',
        price: 2400,
        title: 'iPhone 13 Pro - 128GB',
        location: 'Timisoara'
      },
      {
        image: 'https://via.placeholder.com/300x200',
        price: 2600,
        title: 'iPhone 13 Pro - 512GB',
        location: 'Iasi'
      }
    ];
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }
}