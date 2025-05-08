import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OrganizationService } from './organization.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Import the AuthService
import { AddOrganizationComponent } from '../add-organization/add-organization.component';
import { MatIconModule } from '@angular/material/icon';
import { timer } from 'rxjs';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
})
export class OrganizationComponent implements OnInit {
  organizationList: any[] = [];
  filteredOrganizationList: any[] = [];
  searchQuery: string = '';
  selectedOrganization: any = null;
  userId: string | null = null; // To store the logged-in user ID
  newOrganization: any = {
    name: '',
    contactPerson: '',
    email: '',
    phNo: '',
    address: '',
  };

  @ViewChild('editDialog') editDialog!: TemplateRef<any>;
  @ViewChild('deleteConfirmDialog') deleteConfirmDialog!: TemplateRef<any>; // Reference for the delete confirmation dialog
  @ViewChild('addDialog') addDialog!: TemplateRef<any>;

  constructor(
    private organizationService: OrganizationService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService // Inject the AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.uid) {
        this.userId = user.uid; // Directly fetch userId
        this.fetchOrganizations();
      } else {
        console.warn('User is not authenticated');
      }
    });
  }

  // fetchOrganizations(): void {
  //   this.organizationService.getOrganizations().subscribe({
  //     next: (response) => {
  //       this.organizationList = response.organizations.map((organization: any) => ({
  //         id: organization.organization_id,
  //         name: organization.organization_name,
  //         contactPerson: organization.contact_person,
  //         email: organization.email,
  //         phNo: organization.ph_no,
  //         address: organization.address,
  //       }));
  //       this.filteredOrganizationList = [...this.organizationList];
  //     },
  //     error: (err) => {
  //       console.error('Error fetching organizations:', err);
  //     },
  //   });
  // }
  fetchOrganizations(): void {
    this.organizationService.getOrganizations().subscribe({
      next: (response) => {
        this.organizationList = response.organizations
          .map((organization: any) => ({
            id: organization.organization_id,
            name: organization.organization_name,
            contactPerson: organization.contact_person,
            email: organization.email,
            phNo: organization.ph_no,
            address: organization.address,
            createdAt: organization.created_at || 'N/A', // Ensure valid date
          }))
          .sort((a: { createdAt: string }, b: { createdAt: string }) => {
            const dateA = a.createdAt !== 'N/A' ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt !== 'N/A' ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // Sort in chronological order (oldest first)
          });
  
        this.filteredOrganizationList = [...this.organizationList];
      },
      error: (err) => {
        console.error('Error fetching organizations:', err);
      },
    });
  }
  
  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredOrganizationList = this.organizationList.filter(
      (organization) =>
        organization.name.toLowerCase().includes(query) ||
        organization.email.toLowerCase().includes(query) ||
        organization.phNo.toLowerCase().includes(query) ||
        organization.address.toLowerCase().includes(query)
    );
  }

  // addOrganization(): void {
  //   const dialogRef = this.dialog.open(AddOrganizationComponent, {
  //     width: '500px', height:'650px'
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.newOrganization = {
  //       name: '',
  //       contactPerson: '',
  //       email: '',
  //       phNo: '',
  //       address: '',
  //     };
  //   });
  // }
  addOrganization(): void {
    const dialogRef = this.dialog.open(AddOrganizationComponent, {
      width: '500px',
      height: '650px',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('New organization added:', result);
  
        // Option 1: Update the list instantly
        this.organizationList.push(result);
        this.filteredOrganizationList = [...this.organizationList]; // Refresh UI
  
        // Option 2: Fetch fresh data from backend after a delay
        timer(1000).subscribe(() => this.fetchOrganizations());
      }
    });
  }

  openEditDialog(organization: any): void {
    this.selectedOrganization = { ...organization }; 
    const dialogRef = this.dialog.open(this.editDialog, { width: '500px', height:'650px' });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      this.selectedOrganization = null; 
    });
  }

  saveOrganization(dialogRef: MatDialogRef<any>): void {
    if (!this.userId) {
      console.error('User ID not available');
      return;
    }
  
    console.log('Selected Organization for Update:', this.selectedOrganization);
  
    const updatedData = {
      organization_id: this.selectedOrganization.id,
      organization_name: this.selectedOrganization.name,
      contact_person: this.selectedOrganization.contactPerson,
      email: this.selectedOrganization.email,
      ph_no: this.selectedOrganization.phNo,
      address: this.selectedOrganization.address,
    };
  
    console.log('Payload being sent:', updatedData);
  
    this.organizationService
      .updateOrganization(this.userId, this.selectedOrganization.id, updatedData)
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.showPopup(response.message, 'success');
  
          // Close the dialog after 500ms
          setTimeout(() => {
            dialogRef.close();
          }, 500);
  
          // Auto-refresh the page after closing the dialog
          setTimeout(() => {
            window.location.reload();
          }, 1000); // Refresh after 1 second
        },
        error: (err) => {
          console.error('Error updating organization:', err);
          this.showPopup(
            'An error occurred while updating the organization. Please try again.',
            'error'
          );
        },
      });
  }
  
  

  onDeleteOrganization(id: string): void {
    const dialogRef = this.dialog.open(this.deleteConfirmDialog, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.organizationService.deleteOrganization(id).subscribe({
          next: () => {
            this.fetchOrganizations();
            this.showPopup('Organization deleted successfully', 'success');
          },
          error: (err) => {
            console.error('Error deleting organization:', err);
            this.showPopup('An error occurred while deleting the organization. Please try again.', 'error');
          },
        });
      }
    });
  }

  confirmDelete(dialogRef: any): void {
    dialogRef.close('confirm');
  }

  cancelDelete(dialogRef: any): void {
    dialogRef.close(); 
  }

  capitalizeFirstLetter(str: string): string {
    return str
      ? str
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : '';
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
    popup.style.backgroundColor = 'white'; // White background for error
    popup.style.color = 'black'; // Black text for error
    popup.style.border = '1px solid #ccc'; // Optional border for error messages
  }

  // Add the popup to the body
  document.body.appendChild(popup);

  // Remove the popup after 2 seconds
  setTimeout(() => {
    document.body.removeChild(popup);
  }, 2000);
}


closeDialog(): void {
  this.dialog.closeAll();
}
   

  
  
}
