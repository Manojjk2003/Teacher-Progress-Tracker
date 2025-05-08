import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';

import { ProjectUploadService } from '../../teachers/upload/project-upload.service';

@Component({
  selector: 'app-upload-student',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatFormFieldModule,
    HttpClientModule,
  ],
  templateUrl: './upload-student.component.html',
  styleUrls: ['./upload-student.component.css'],
  providers: [ProjectUploadService],
})
export class UploadStudentComponent implements OnInit {
  projectForm!: FormGroup;
  isLoading = false;
  grades = [6, 7, 8, 9];
  sections = ['A', 'B', 'C', 'D'];
  formSubmitted = false;
  maxProjectLinks = 20;

  // URL pattern for strict validation
  urlPattern = '^https:\\/\\/scratch\\.mit\\.edu\\/projects\\/\\d{1,10}$'; // Strict validation
  maxUrlLength = 50; // Max length of URL

  constructor(
    private fb: FormBuilder,
    private uploadService: ProjectUploadService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.projectForm = this.fb.group({
      noOfStudents: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      grade: ['', Validators.required],
      section: ['', Validators.required],
      projectLinks: this.fb.array([this.createProjectLink()]),
      comments: [''],
    });
  }
 // Create a new project link form group
 createProjectLink() {
  return this.fb.group({
    link: ['', [
      Validators.required,
      Validators.pattern(this.urlPattern), // URL validation using regex
      Validators.maxLength(this.maxUrlLength) // Max length validation
    ]]
  });
}

  get projectLinks() {
    return this.projectForm.get('projectLinks') as FormArray;
  }

  // addProjectLink() {
  //   this.projectLinks.push(this.createProjectLink());
  // }
  addProjectLink() {
    if (this.projectLinks.length < this.maxProjectLinks) {
      this.projectLinks.push(this.createProjectLink());
    } else {
      this.showPopup(`You can add a maximum of ${this.maxProjectLinks} project links.`, 'warning');
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
  

  // removeProjectLink(index: number) {
  //   const linkControl = this.projectLinks.at(index);
  //   if (linkControl) {
  //     linkControl.get('link')?.setValue(''); // Clear only the input field
  //   }
  // }
  // removeProjectLink(index: number) {
  //   if (this.projectLinks.length > 1) {
  //     this.projectLinks.removeAt(index);
  //   } else {
  //     this.showPopup('At least one project link is required', 'error');
  //   }
  // }
  

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.projectForm.valid) {
      this.isLoading = true;
  
      // Retrieve teacher ID from session storage
      const teacherId = sessionStorage.getItem('teacherId');
      if (!teacherId) {
        this.showPopup('Teacher ID not found. Please log in again.', 'error');
        this.isLoading = false;
        return;
      }
  
      // Prepare the session data in the required format
      const sessionData = {
        no_of_students: this.projectForm.value.noOfStudents,
        grade: this.projectForm.value.grade,
        section: this.projectForm.value.section,
        feedback: this.projectForm.value.comments,
      };
  
      // Prepare the final payload with the project links
      const projects = this.projectForm.value.projectLinks.map((link: { link: string }) => ({
        project_link: link.link,
      }));
  
      // Check for duplicate links in the input
      const duplicateLink = this.hasDuplicateLinks(projects);
      if (duplicateLink) {
        this.showPopup(`Duplicate project link found: ${duplicateLink}`, 'error');
        this.isLoading = false;
        return;
      }
  
      // Call the upload service with the formatted payload
      this.uploadService.uploadStudentProject(teacherId, { session_data: sessionData, projects }).subscribe({
        next: (response) => {
          console.log('Response:', response);
  
          const existingLinks: string[] = [];
          const newLinksUploaded: string[] = [];
  
          if (Array.isArray(response.message)) {
            response.message.forEach((msg: string, index: number) => {
              const link = projects[index]?.project_link || 'Unknown Link';
  
              if (msg.includes('already exists')) {
                existingLinks.push(link);
              } else if (msg.includes('uploaded successfully')) {
                newLinksUploaded.push(link);
              }
            });
          }
  
          // Show appropriate messages based on upload results
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
  
          // Reset form after handling response
          this.isLoading = false;
          this.resetForm();
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.isLoading = false;
          this.showPopup('Failed to upload project. Please try again.', 'error');
          this.resetForm();
        },
      });
    } else {
      this.showPopup('Please fill  all required fields correctly.', 'error');
    }
  }
  

  // Function to check for duplicate links in the project links array
  private hasDuplicateLinks(projects: { project_link: string }[]): string | null {
    const links = projects.map((project) => project.project_link);
    const uniqueLinks = new Set(links);
    if (links.length !== uniqueLinks.size) {
      const duplicateLink = links.find(
        (link, index, self) => self.indexOf(link) !== index
      );
      return duplicateLink || null;
    }
    return null;
  }

  // Filter out the project link from the error message
  private filterProjectLink(message: string): string {
    const urlPattern = /https?:\/\/[^\s]+/g; // Regex to detect URLs
    return message.replace(urlPattern, ''); // Remove the URL part from the error message
  }
  private resetForm() {
    this.projectForm.reset();
    while (this.projectLinks.length > 1) {
      this.projectLinks.removeAt(1);
    }
  }
  private showPopup(message: string, type: 'success' | 'error' | 'warning') {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.fontSize = '16px';
    popup.style.whiteSpace = 'pre-line'; // Allow new lines in messages
    popup.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '1000';
  
    // Background and text colors based on the type
    if (type === 'success') {
      popup.style.backgroundColor = 'green';
      popup.style.color = 'white';
    } else if (type === 'error') {
      popup.style.backgroundColor = 'red';
      popup.style.color = 'white';
    } else if (type === 'warning') {
      popup.style.backgroundColor = 'orange';
      popup.style.color = 'white';
    }
  
    document.body.appendChild(popup);
  
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 6000);
  }
  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
  
}