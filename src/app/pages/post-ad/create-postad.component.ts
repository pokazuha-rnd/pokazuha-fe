import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostadService } from '../../services/postad.service';

@Component({
  selector: 'app-create-postad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-postad.component.html',
  styleUrls: ['./create-postad.component.css']
})
export class CreatePostadComponent {
  postadForm: FormGroup;
  isSubmitting = false;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  categories = [
    'Electronics',
    'Vehicles',
    'Real Estate',
    'Home & Garden',
    'Sports',
    'Fashion',
    'Jobs',
    'Services',
    'Other'
  ];

  conditions = [
    'New',
    'Like New',
    'Good',
    'Fair',
    'For Parts'
  ];

  currencies = ['Lei', 'Euro', 'USD'];

  constructor(
    private fb: FormBuilder,
    private postadService: PostadService,
    private router: Router
  ) {
    this.postadForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(5000)]],
      price: [0, [Validators.required, Validators.min(0)]],
      currency: ['Lei', Validators.required],
      category: ['', Validators.required],
      condition: ['', Validators.required],
      location: ['', [Validators.required, Validators.maxLength(200)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      showEmailToPublic: [false]
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    
    if (files.length + this.selectedFiles.length > 10) {
      this.errorMessage = 'Maximum 10 images allowed';
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Only image files are allowed';
        continue;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size must be less than 5MB';
        continue;
      }

      this.selectedFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    this.errorMessage = '';
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  onSubmit() {
    // Mark all fields as touched to show validation errors
    if (this.postadForm.invalid) {
      Object.keys(this.postadForm.controls).forEach(key => {
        this.postadForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Validate images
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'Please select at least one image';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.postadForm.value;
    const request = {
      ...formValue,
      images: this.selectedFiles
    };

    console.log('Submitting postad:', request);

    this.postadService.createPostad(request).subscribe({
      next: (response) => {
        console.log('✅ Postad created successfully:', response);
        this.successMessage = 'Your ad has been posted successfully!';
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error creating postad:', error);
        this.errorMessage = error.error?.message || 'An error occurred while creating the ad. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  // Helper method to check if field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.postadForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get error message
  getErrorMessage(fieldName: string): string {
    const field = this.postadForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['maxLength']) return `Maximum length exceeded`;
    if (field.errors['min']) return `Value must be 0 or greater`;
    if (field.errors['pattern']) return `Invalid format`;

    return 'Invalid value';
  }
}