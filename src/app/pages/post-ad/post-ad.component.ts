import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PostadService } from '../../services/postad.service';
import { LocationService, Location } from '../../services/location.service';

interface SelectedFile {
  file: File;
  preview: string;
}

interface ExistingImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

@Component({
  selector: 'app-post-ad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './post-ad.component.html'
})
export class PostAdComponent implements OnInit {
  adForm!: FormGroup;
  selectedFiles: SelectedFile[] = [];
  isSubmitting = false;
  errorMessage: string = '';
  
  // Edit mode properties
  isEditMode = false;
  postadId: string | null = null;
  
  // Existing images (for edit mode)
  existingImages: ExistingImage[] = [];
  imageIdsToDelete: string[] = [];
  
  conditions = ['New', 'Like New', 'Good', 'Fair', 'For Parts'];
  
  // Dynamic locations from backend
  locations: Location[] = [];
  isLoadingLocations = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private postadService: PostadService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    // Load locations from backend
    this.loadLocations();

    // Initialize form
    this.adForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(0)]],
      condition: ['Good'],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(5000)]],
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\+\-\(\)]+$/)]],
      showEmail: [false],
      agreeToTerms: [false, Validators.requiredTrue]
    });

    // Check if we're in edit mode
    this.route.paramMap.subscribe(params => {
      this.postadId = params.get('id');
      if (this.postadId) {
        this.isEditMode = true;
        this.loadPostadData(this.postadId);
      }
    });
  }

  loadLocations(): void {
    this.locationService.getLocations().subscribe({
      next: (locations) => {
        this.locations = locations;
        this.isLoadingLocations = false;
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        this.isLoadingLocations = false;
      }
    });
  }

  loadPostadData(id: string) {
    this.postadService.getPostadById(id).subscribe({
      next: (postad) => {
        // Map backend data to form
        this.adForm.patchValue({
          category: this.mapCategoryFromBackend(postad.category),
          title: postad.title,
          price: postad.price,
          condition: postad.condition,
          description: postad.description,
          location: postad.location,
          phone: postad.phoneNumber,
          showEmail: postad.showEmailToPublic,
          agreeToTerms: true
        });

        // Load existing images
        if (postad.images && postad.images.length > 0) {
          this.existingImages = postad.images.map(img => ({
            id: img.id,
            url: this.postadService.getImageUrl(img.imageUrl),
            isPrimary: img.isPrimary
          }));
          console.log('Loaded existing images:', this.existingImages);
        }
      },
      error: (error) => {
        console.error('Error loading postad:', error);
        this.errorMessage = 'Failed to load ad data. Please try again.';
        this.router.navigate(['/my-postads']);
      }
    });
  }

  onFileSelect(event: any) {
    const files: FileList = event.target.files;
    
    if (files) {
      // Calculate total images (existing + new + already selected)
      const totalImages = this.existingImages.length + this.selectedFiles.length + files.length;
      
      if (totalImages > 10) {
        this.errorMessage = 'You can have maximum 10 photos total';
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.size > 5 * 1024 * 1024) {
          this.errorMessage = `File ${file.name} is too large. Maximum size is 5MB`;
          continue;
        }

        if (!file.type.startsWith('image/')) {
          this.errorMessage = `File ${file.name} is not an image`;
          continue;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedFiles.push({
            file: file,
            preview: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    }

    event.target.value = '';
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  removeExistingImage(imageId: string) {
    // Mark image for deletion
    this.imageIdsToDelete.push(imageId);
    
    // Remove from display
    this.existingImages = this.existingImages.filter(img => img.id !== imageId);
    
    console.log('Marked for deletion:', imageId);
    console.log('Images to delete:', this.imageIdsToDelete);
  }

  getTotalImageCount(): number {
    return this.existingImages.length + this.selectedFiles.length;
  }

  onSubmit() {
    if (this.adForm.invalid) {
      Object.keys(this.adForm.controls).forEach(key => {
        this.adForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Check if we have at least one image (existing or new)
    if (this.getTotalImageCount() === 0) {
      this.errorMessage = 'Please select at least one photo';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.adForm.value;

    if (this.isEditMode && this.postadId) {
      // UPDATE existing postad
      this.updatePostad(this.postadId, formValue);
    } else {
      // CREATE new postad
      this.createPostad(formValue);
    }
  }

  private createPostad(formValue: any) {
    const request = {
      title: formValue.title,
      description: formValue.description,
      price: parseFloat(formValue.price),
      currency: 'USD',
      category: this.mapCategoryToBackend(formValue.category),
      condition: formValue.condition,
      location: formValue.location,
      phoneNumber: formValue.phone,
      showEmailToPublic: formValue.showEmail,
      images: this.selectedFiles.map(item => item.file)
    };

    console.log('📤 Creating postad:', request);

    this.postadService.createPostad(request).subscribe({
      next: (response) => {
        console.log('✅ Postad created successfully:', response);
        this.isSubmitting = false;
        this.router.navigate(['/my-postads']);
      },
      error: (error) => {
        console.error('❌ Error creating postad:', error);
        this.errorMessage = error.error?.message || 'An error occurred while posting your ad. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  private updatePostad(id: string, formValue: any) {
    const updateRequest = {
      title: formValue.title,
      description: formValue.description,
      price: parseFloat(formValue.price),
      currency: 'USD',
      category: this.mapCategoryToBackend(formValue.category),
      condition: formValue.condition,
      location: formValue.location,
      phoneNumber: formValue.phone,
      showEmailToPublic: formValue.showEmail,
      newImages: this.selectedFiles.map(item => item.file),
      imageIdsToDelete: this.imageIdsToDelete
    };

    console.log('📤 Updating postad:', updateRequest);
    console.log('New images count:', updateRequest.newImages.length);
    console.log('Images to delete count:', updateRequest.imageIdsToDelete.length);

    this.postadService.updatePostad(id, updateRequest).subscribe({
      next: (response) => {
        console.log('✅ Postad updated successfully:', response);
        this.isSubmitting = false;
        this.router.navigate(['/my-postads']);
      },
      error: (error) => {
        console.error('❌ Error updating postad:', error);
        this.errorMessage = error.error?.message || 'An error occurred while updating your ad.';
        this.isSubmitting = false;
      }
    });
  }

  private mapCategoryToBackend(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'electronics': 'Electronics',
      'furniture': 'Home & Garden',
      'vehicles': 'Vehicles',
      'clothing': 'Fashion',
      'books': 'Other',
      'sports': 'Sports',
      'housing': 'Real Estate',
      'jobs': 'Jobs',
      'services': 'Services',
      'other': 'Other'
    };

    return categoryMap[category] || 'Other';
  }

  private mapCategoryFromBackend(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Electronics': 'electronics',
      'Home & Garden': 'furniture',
      'Vehicles': 'vehicles',
      'Fashion': 'clothing',
      'Sports': 'sports',
      'Real Estate': 'housing',
      'Jobs': 'jobs',
      'Services': 'services',
      'Other': 'other'
    };

    return categoryMap[category] || 'other';
  }
}