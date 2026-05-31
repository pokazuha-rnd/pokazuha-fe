import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreatePostadRequest {
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: string;
  location: string;
  phoneNumber: string;
  showEmailToPublic: boolean;
  images: File[];
}

export interface PostadDto {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: string;
  location: string;
  phoneNumber: string;
  showEmailToPublic: boolean;
  status: string;
  viewCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  images: PostadImageDto[];
}

export interface PostadImageDto {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  order: number;
}

export interface PaginatedPostadsDto {
  postads: PostadListDto[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PostadListDto {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: string;
  location: string;
  status: string;
  viewCount: number;
  isFeatured: boolean;
  createdAt: string;
  images: PostadImageDto[];
  primaryImageUrl: string;
}

export interface UpdatePostadRequest {
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: string;
  location: string;
  phoneNumber: string;
  showEmailToPublic: boolean;
  newImages?: File[];
  imageIdsToDelete?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PostadService {
  private apiUrl = `${environment.apiUrl}/api/Postads`;

  constructor(private http: HttpClient) {}

  /**
   * Create new postad
   */
  createPostad(request: CreatePostadRequest): Observable<PostadDto> {
    const formData = new FormData();
    
    // Append all form fields
    formData.append('Title', request.title);
    formData.append('Description', request.description);
    formData.append('Price', request.price.toString());
    formData.append('Currency', request.currency);
    formData.append('Category', request.category);
    formData.append('Condition', request.condition);
    formData.append('Location', request.location);
    formData.append('PhoneNumber', request.phoneNumber);
    formData.append('ShowEmailToPublic', request.showEmailToPublic.toString());
    
    // Append images
    request.images.forEach((image) => {
      formData.append('Images', image, image.name);
    });

    return this.http.post<PostadDto>(this.apiUrl, formData);
  }

  /**
   * Get all active postads with pagination
   */
  getActivePostads(pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedPostadsDto> {
    return this.http.get<PaginatedPostadsDto>(
      `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  /**
   * Search postads with filters
   */
  searchPostads(
    searchTerm?: string,
    category?: string,
    location?: string,
    minPrice?: number,
    maxPrice?: number,
    condition?: string,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<PaginatedPostadsDto> {
    let url = `${this.apiUrl}/search?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    
    if (searchTerm) url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (location) url += `&location=${encodeURIComponent(location)}`;
    if (minPrice !== undefined) url += `&minPrice=${minPrice}`;
    if (maxPrice !== undefined) url += `&maxPrice=${maxPrice}`;
    if (condition) url += `&condition=${encodeURIComponent(condition)}`;

    return this.http.get<PaginatedPostadsDto>(url);
  }

  /**
   * Get postad by ID
   */
  getPostadById(id: string): Observable<PostadDto> {
    return this.http.get<PostadDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get current user's postads
   */
  getMyPostads(pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedPostadsDto> {
    return this.http.get<PaginatedPostadsDto>(
      `${this.apiUrl}/my-postads?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  /**
   * Delete postad
   */
  deletePostad(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get image URL
   */
  getImageUrl(imageUrl: string): string {
    // imageUrl format: "89976abc-40f0-46d1-96cb-4fb0ce84fe0b/ee6e968b-f22a-4a98-88c7-76a8705086c3_Test-Image.jpg"
    return `${environment.apiUrl}/uploads/${imageUrl}`;
  }

  /**
 * Update existing postad
 */
updatePostad(id: string, request: UpdatePostadRequest): Observable<PostadDto> {
  const formData = new FormData();
  
  // Append the ID
  formData.append('Id', id);
  
  // Append all form fields
  formData.append('Title', request.title);
  formData.append('Description', request.description);
  formData.append('Price', request.price.toString());
  formData.append('Currency', request.currency);
  formData.append('Category', request.category);
  formData.append('Condition', request.condition);
  formData.append('Location', request.location);
  formData.append('PhoneNumber', request.phoneNumber);
  formData.append('ShowEmailToPublic', request.showEmailToPublic.toString());
  
  // Append NEW images if provided
  if (request.newImages && request.newImages.length > 0) {
    request.newImages.forEach((image) => {
      formData.append('NewImages', image, image.name);
    });
  }

  // Append image IDs to delete if provided
  if (request.imageIdsToDelete && request.imageIdsToDelete.length > 0) {
    request.imageIdsToDelete.forEach((imageId) => {
      formData.append('ImageIdsToDelete', imageId);
    });
  }

  return this.http.put<PostadDto>(`${this.apiUrl}/${id}`, formData);
}
}