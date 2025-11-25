import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostadService } from '../../services/postad.service';

interface SelectedFile {
  file: File;
  preview: string;
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
  
  conditions = ['New', 'Like New', 'Good', 'Fair', 'For Parts'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private postadService: PostadService
  ) {}

  ngOnInit() {
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
  }

  onFileSelect(event: any) {
    const files: FileList = event.target.files;
    
    if (files) {
      // Check total count (max 10 pentru backend-ul tău)
      if (this.selectedFiles.length + files.length > 10) {
        alert('You can upload maximum 10 photos');
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image`);
          continue;
        }

        // Create preview
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

    // Reset input
    event.target.value = '';
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    if (this.adForm.invalid) {
      // Mark all fields as touched to show errors
      Object.keys(this.adForm.controls).forEach(key => {
        this.adForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.selectedFiles.length === 0) {
      alert('Please select at least one photo');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Map form values to backend DTO format
    const formValue = this.adForm.value;
    
    const request = {
      title: formValue.title,
      description: formValue.description,
      price: parseFloat(formValue.price),
      currency: 'Lei', // Default currency
      category: this.mapCategoryToBackend(formValue.category),
      condition: formValue.condition,
      location: formValue.location,
      phoneNumber: formValue.phone,
      showEmailToPublic: formValue.showEmail,
      images: this.selectedFiles.map(item => item.file)
    };

    console.log('📤 Sending request to backend:', request);

    this.postadService.createPostad(request).subscribe({
      next: (response) => {
        console.log('✅ Postad created successfully:', response);
        alert('Your ad has been posted successfully!');
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('❌ Error creating postad:', error);
        this.errorMessage = error.error?.message || 'An error occurred while posting your ad. Please try again.';
        alert(this.errorMessage);
        this.isSubmitting = false;
      }
    });
  }

  // Map frontend categories to backend categories
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
      'services': 'Services'
    };

    return categoryMap[category] || 'Other';
  }
}