import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectUploadService } from '../../teachers/upload/project-upload.service';

@Component({
  selector: 'app-upload-teacher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './upload-teacher.component.html',
  styleUrls: ['./upload-teacher.component.css'],
})
export class UploadTeacherComponent implements OnInit {
  projectForm: FormGroup;
  isLoading = false;
urlPattern = '^https:\\/\\/scratch\\.mit\\.edu\\/projects\\/\\d{1,10}$'; // Strict validation
  maxUrlLength = 10;
  teacherId: string | null = null;
  maxProjectLinks = 20;

  constructor(
    private fb: FormBuilder,
    private uploadService: ProjectUploadService
  ) {
    this.projectForm = this.fb.group({
      projectLinks: this.fb.array([this.createProjectLink()]),
      comments: [''],
    });
  }

  ngOnInit(): void {
    // Retrieve teacher ID from session storage
    this.teacherId = sessionStorage.getItem('teacherId');

    if (!this.teacherId) {
      this.showPopup('Teacher ID is not available. Please log in again or contact support.', 'error');
      console.log('Teacher ID not found in session storage.');
    } else {
      console.log('Teacher ID retrieved from session storage:', this.teacherId);
    }
  }

  get projectLinks(): FormArray {
    return this.projectForm.get('projectLinks') as FormArray;
  }

  createProjectLink(): FormGroup {
    return this.fb.group({
      link: ['', [Validators.required, Validators.pattern(this.urlPattern)]],
    });
  }

  // addProjectLink(): void {
  //   this.projectLinks.push(this.createProjectLink());
  // }
  addProjectLink() {
    if (this.projectLinks.length < this.maxProjectLinks) {
      this.projectLinks.push(this.createProjectLink());
    } else {
      this.showPopup(`You can add a maximum of ${this.maxProjectLinks} project links.`, 'error');
    }
  }

  clearProjectLink(index: number) {
    const linkControl = this.projectLinks.at(index);
    if (linkControl) {
      linkControl.get('link')?.setValue(''); // Clear only the input field
    }
  }
  
  removeProjectLink(index: number) {
    if (this.projectLinks.length > 1) {
      this.projectLinks.removeAt(index); // Remove only from the second input onwards
    }
  }
  
  onSubmit(): void {
  if (!this.teacherId) {
    this.showPopup('Teacher ID is not available. Please log in again or contact support.', 'error');
    return;
  }

  if (this.projectForm.valid) {
    this.isLoading = true;

    const projectBatch = this.projectForm.value.projectLinks.map((link: any) => ({
      project_link: link.link,
      feedback: this.projectForm.value.comments,
    }));

    this.uploadService.uploadTeacherProject(this.teacherId, projectBatch).subscribe(
      (response) => {
        this.isLoading = false;

        // Initialize arrays for existing and new links
        const existingLinks: string[] = [];
        const newLinksUploaded: string[] = [];

        // Extract links from the response message
        if (Array.isArray(response.message)) {
          response.message.forEach((msg: string, index: number) => {
            const link = projectBatch[index]?.project_link || 'Unknown Link';

            if (msg.includes('already exists')) {
              existingLinks.push(link);
            } else if (msg.includes('uploaded successfully')) {
              newLinksUploaded.push(link);
            }
          });
        }

        // Display appropriate messages
        if (existingLinks.length > 0 && newLinksUploaded.length > 0) {
          this.showPopup(
            `Some projects were uploaded successfully:\n${newLinksUploaded.join('\n')}\n\nBut the following projects already exist and were not uploaded:\n${existingLinks.join('\n')}`,
            'warning'
          );
        } else if (existingLinks.length > 0) {
          this.showPopup(
            `The following projects are already uploaded and cannot be uploaded again:\n${existingLinks.join('\n')}`,
            'error'
          );
        } else if (newLinksUploaded.length > 0) {
          this.showPopup(
            `Projects uploaded successfully:\n${newLinksUploaded.join('\n')}`,
            'success'
          );
        } else {
          this.showPopup('Failed to upload projects.', 'error');
        }

        // Reset form after handling the response
        this.resetForm();
      },
      (err) => {
        this.isLoading = false;
        console.error('Error uploading teacher projects:', err);
        this.showPopup('Upload failed. Please try again.', 'error');
        this.resetForm();
      }
    );
  } else {
    this.showPopup('Please ensure all fields are valid.', 'error');
    this.resetForm();
  }
}

  
  // Reset the form
  resetForm(): void {
    this.projectForm.reset();
    this.projectLinks.clear(); // Clear any existing project links
    this.projectLinks.push(this.createProjectLink()); // Add a new blank project link after reset
  }
  
  showPopup(message: string, type: 'success' | 'error' | 'warning') {
    const popup = document.createElement('div');
    popup.innerText = message;
  
    // Styling
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.fontSize = '20px';
    popup.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '1000';
  
    // Set background and text color based on the message type
    if (type === 'success') {
      popup.style.backgroundColor = 'green'; // Green for success
      popup.style.color = 'white';
    } else if (type === 'error') {
      popup.style.backgroundColor = 'red'; // Red for error
      popup.style.color = 'white';
    } else if (type === 'warning') {
      popup.style.backgroundColor = 'orange'; // Orange for warnings
      popup.style.color = 'white';
    }
  
    // Add the popup to the body
    document.body.appendChild(popup);
  
    // Remove the popup after 2 seconds
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 6000);
  }
  
} 