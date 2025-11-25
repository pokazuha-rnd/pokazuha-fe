// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-listing-list-view',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   template: `
//     <div class="space-y-2">
      
//       <div *ngFor="let listing of listings" 
//            [routerLink]="['/listing', listing.id]"
//            class="bg-white border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
//         <div class="flex gap-4 p-3">
          
//           <!-- Thumbnail -->
//           <div class="flex-shrink-0">
//             <img [src]="listing.image" 
//                  [alt]="listing.title" 
//                  class="w-24 h-24 object-cover rounded">
//           </div>

//           <!-- Content -->
//           <div class="flex-1 min-w-0">
//             <div class="flex items-start justify-between gap-4">
//               <div class="flex-1">
//                 <h3 class="font-semibold text-gray-900 hover:text-primary-600 mb-1">
//                   {{ listing.title }}
//                 </h3>
//                 <p class="text-sm text-gray-600 line-clamp-2 mb-2">
//                   {{ listing.description }}
//                 </p>
//                 <div class="flex items-center gap-3 text-xs text-gray-500">
//                   <span class="flex items-center gap-1">
//                     <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                       <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
//                     </svg>
//                     {{ listing.location }}
//                   </span>
//                   <span>{{ listing.category }}</span>
//                   <span>{{ listing.timeAgo }}</span>
//                 </div>
//               </div>

//               <!-- Price -->
//               <div class="flex-shrink-0 text-right">
//                 <div class="text-xl font-bold text-primary-600">
//                   {{ listing.price }} lei
//                 </div>
//                 <button (click)="onFavorite($event, listing)" 
//                         class="text-gray-400 hover:text-red-500 mt-2">
//                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//     </div>
//   `
// })
// export class ListingListViewComponent {
//   @Input() listings: any[] = [];

//   onFavorite(event: Event, listing: any) {
//     event.preventDefault();
//     event.stopPropagation();
//     console.log('Favorited:', listing);
//     // TODO: Implement favorite functionality
//   }
// }