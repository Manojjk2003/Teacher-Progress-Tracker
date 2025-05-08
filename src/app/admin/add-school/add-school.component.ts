import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service'; // Path to your AuthService
import { AddSchoolService } from './add-school.service'; // Path to your SchoolService
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Add this import
import { MatSnackBar } from '@angular/material/snack-bar'; // <-- Import MatSnackBar
import { Router } from '@angular/router'; // <-- Import Router for redirection
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-school',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,  // <-- Include FormsModule
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.css'],
})
export class AddSchoolComponent {
  userId: string = ''; // Store userId here
  organizations: any[] = [];
  schoolDetails = {
    school_name: '',
    email: '',
    ph_no: '',
    addr: '',
    organization_id: '',
  };


  private authService = inject(AuthService);
  private schoolService = inject(AddSchoolService);
  private snackBar = inject(MatSnackBar); // Inject MatSnackBar
  private router = inject(Router); // Inject Router

  constructor(public dialogRef: MatDialogRef<AddSchoolComponent>) {
    this.dialogRef = dialogRef; // Ensure it's initialized in the constructor
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.uid) {
        console.log('Current User UID:', user.uid);
        this.userId = user.uid;
        this.loadOrganizations(); // Load organizations once the userId is available
      } else {
        console.warn('User is not authenticated');
      }
    });
  }

  loadOrganizations(): void {
    // Fetch organizations if user is authenticated
    this.schoolService.getOrganizations().subscribe(
      (response: any) => {
        console.log('Fetched organizations:', response); // Log the fetched organizations
        this.organizations = response.organizations || []; // Ensure it falls back to an empty array if undefined
      },
      (error) => {
        console.error('Error fetching organizations:', error); // Log any errors
      }
    );
  }

  onSubmit(form?: any): void {
    if (this.userId) {
      this.schoolService.addSchool(this.userId, this.schoolDetails).subscribe(
        (response) => {
          console.log('School added successfully', response);
  
          // Show success notification
          this.snackBar.open('School added successfully!', 'Close', { duration: 3000 });
  
          // Close the dialog immediately
          this.dialogRef.close(response); 
  
          // Reset the form after closing the dialog (if a form is passed)
          if (form) {
            form.reset();
            Object.keys(form.controls).forEach((key) => {
              form.get(key)?.markAsPristine();
              form.get(key)?.markAsUntouched();
            });
          }
  
          // Show a custom popup success message
          this.showPopup('School added successfully!', 'success');
  
          // Redirect after 3 seconds
          setTimeout(() => {
            this.router.navigate(['admin-navbar/schools']);
          }, 3000);
        },
        (error) => {
          console.error('Error adding school', error);
  
          // Show error notification
          this.snackBar.open('Error adding school. Please try again.', 'Close', { duration: 3000 });
  
          // Show a custom popup error message
          this.showPopup('Error adding school. Please try again.', 'error');
        }
      );
    } else {
      console.warn('No user ID found');
    }
  }
  onCancel() {
    this.dialogRef.close();
  }

  showPopup(message: string, type: 'success' | 'error'): void {
    const popup = document.createElement('div');
    popup.innerText = message;
    
    // Positioning and styling
    popup.style.position = 'fixed';
    popup.style.top = '20px'; // Position at the top
    popup.style.left = '50%'; // Center horizontally
    popup.style.transform = 'translateX(-50%)'; // Adjust for perfect centering
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.fontSize = '20px';
    popup.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '1000';
  
    // Set background and text color based on the message type
    if (type === 'success') {
      popup.style.backgroundColor = 'green'; // Green background for success
      popup.style.color = 'white'; // White text for success
    } else if (type === 'error') {
      popup.style.backgroundColor = 'red'; // White background for error
      popup.style.color = 'white'; // Black text for error
      popup.style.border = '1px solid #ccc'; // Optional border for error messages
    }
  
    // Add the popup to the body
    document.body.appendChild(popup);
  
    // Remove the popup after 2 seconds
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 2000);
  }

  blockNumbers(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Check if the input contains numbers
    if (/\d/.test(value)) {
      input.value = value.replace(/\d/g, ''); // Replace numbers with an empty string
    }
  }
  
  blockAlphabets(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    // Block non-numeric characters
    if (/[a-zA-Z]/.test(value)) {
      input.value = value.replace(/[a-zA-Z]/g, ''); // Remove alphabets
    }
  
    // Enforce maxlength of 10
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10); // Trim to 10 characters if more than 10
    }
  }
  validatePhone(): boolean {
    return /^[0-9]{10}$/.test(this.schoolDetails.ph_no);
  }
}