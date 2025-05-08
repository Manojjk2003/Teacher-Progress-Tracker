import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Adjust the path if necessary
import { AddOrganizationService } from './add-organization.service'; // Adjust the path if necessary
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-organization',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-organization.component.html',
  styleUrls: ['./add-organization.component.css'],
})
export class AddOrganizationComponent implements OnInit {
  users_id: string | null = null;

  constructor(
    private organizationService: AddOrganizationService,
    private router: Router,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AddOrganizationComponent>
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.users_id = user.uid; // Assuming UID is the users_id
      }
    });
  }

  // Method to show custom popup messages
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

  // onSubmit(form: any): void {
  //   if (this.users_id && form.valid) {
  //     this.organizationService.addOrganization(this.users_id, form.value).subscribe({
  //       next: (response) => {
  //         // Show success message using showPopup
  //         this.showPopup('Organization added successfully!', 'success');
  
  //         // Close the dialog immediately
  //         this.dialogRef.close();
  
  //         // Refresh the form by clearing input values (if needed)
  //         form.reset();
  //         Object.keys(form.controls).forEach((key) => {
  //           form.get(key)?.markAsPristine();
  //           form.get(key)?.markAsUntouched();
  //         });
  
  //         // Optionally, navigate to another page
  //         setTimeout(() => {
  //           this.router.navigate(['admin-navbar/organization']); // Redirect after a delay
  //         }, 2000);
  //       },
  //       error: (err) => {
  //         // Show error message using showPopup
  //         this.showPopup('Failed to add organization. Please try again.', 'error');
  //       },
  //     });
  //   } else {
  //     this.showPopup('No users_id available for submission', 'error');
  //   };
  // }

  onSubmit(form: any): void {
    if (this.users_id && form.valid) {
      this.organizationService.addOrganization(this.users_id, form.value).subscribe({
        next: (response) => {
          // Show success message
          this.showPopup('Organization added successfully!', 'success');
  
          // Close the dialog and pass the response to the parent component
          this.dialogRef.close(response);
  
          // Clear form fields after submission
          form.reset();
          Object.keys(form.controls).forEach((key) => {
            form.get(key)?.markAsPristine();
            form.get(key)?.markAsUntouched();
          });
  
          // Optionally, navigate after a short delay
          setTimeout(() => {
            this.router.navigate(['admin-navbar/organization']);
          }, 2000);
        },
        error: (err) => {
          // Show error message
          this.showPopup('Failed to add organization. Please try again.', 'error');
        },
      });
    } else {
      this.showPopup('No users_id available for submission', 'error');
    }
  }
  
  
  
  onCancel(): void {
    this.dialogRef.close();
  }

  blockNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[0-9]/g, ''); // Removes any numeric characters
  }

  blockAlphabetics(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Remove alphabetic characters and limit to 10 digits
    input.value = input.value.replace(/[a-zA-Z]/g, '');  // Removes any alphabetic characters
    input.value = input.value.substring(0, 10);  // Limits the input to 10 characters
  }
}