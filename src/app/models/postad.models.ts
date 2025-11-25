export interface Postad {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: string;
  location: string;
  phoneNumber?: string;
  showEmailToPublic: boolean;
  status: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail?: string;
  images: PostadImage[];
}

export interface PostadImage {
  id: string;
  postadId: string;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  isPrimary: boolean;
  order: number;
  uploadedAt: string;
}

export interface PostadListDto {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  condition: string;
  location: string;
  status: string;
  viewCount: number;
  createdAt: string;
  primaryImageUrl?: string;
  userName: string;
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

export interface CreatePostadRequest {
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: string;
  location: string;
  phoneNumber?: string;
  showEmailToPublic: boolean;
  images: File[];
}