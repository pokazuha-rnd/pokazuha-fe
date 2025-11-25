import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListingListViewComponent } from '../listing-list-view/listing-list-view.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ListingListViewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  viewMode: 'grid' | 'list' = 'list'; // Start with list view

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }
}