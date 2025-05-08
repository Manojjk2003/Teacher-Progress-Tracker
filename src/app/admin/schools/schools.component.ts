import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { SchoolService } from './schools.service';
import { Router } from '@angular/router';
import { AddSchoolComponent } from '../add-school/add-school.component';
import { MatIconModule } from '@angular/material/icon';
import { timer } from 'rxjs';

@Component({
  selector: 'app-schools',
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
    MatSelectModule,
    MatOptionModule,
    MatIconModule
  ],
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css'],
})
export class SchoolsComponent implements OnInit {
  schoolList: any[] = [];
  filteredSchoolList: any[] = [];
  organizationList: any[] = [];
  searchQuery: string = '';
  selectedSchool: any = null;
  originalSchoolData: any = null; // To track original data before editing

  @ViewChild('editDialog') editDialog!: TemplateRef<any>;
  @ViewChild('deleteConfirmDialog') deleteConfirmDialog!: TemplateRef<any>;

  constructor(
    private schoolService: SchoolService,
    private dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.fetchOrganizations();
    this.fetchSchools();
  }

  // fetchSchools(): void {
  //   this.schoolService.getSchools().subscribe({
  //     next: (response: any) => {
  //       this.schoolList = response.schools.map((school: any) => ({
  //         id: school.School_id,
  //         school_name: school.school_name,
  //         address: school.address,
  //         email: school.email,
  //         contact_no: school.contact_no,
  //         no_of_teachers: school.no_of_teachers,
  //         organization_id: school.organization_id,
  //         organization_name: school.organization_name,
  //       }));
  //       this.filteredSchoolList = [...this.schoolList];
  //     },
  //     error: (err: any) => {
  //       console.error('Error fetching schools:', err);
  //     },
  //   });
  // }
  
  fetchSchools(): void {
    this.schoolService.getSchools().subscribe({
      next: (response: any) => {
        this.schoolList = response.schools
          .map((school: any) => ({
            id: school.School_id,
            school_name: school.school_name,
            address: school.address,
            email: school.email,
            contact_no: school.contact_no,
            no_of_teachers: school.no_of_teachers,
            organization_id: school.organization_id,
            organization_name: school.organization_name,
            createdAt: school.created_at || 'N/A', // Ensure valid date
          }))
          .sort((a: { createdAt: string }, b: { createdAt: string }) => {
            const dateA = a.createdAt !== 'N/A' ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt !== 'N/A' ? new Date(b.createdAt).getTime() : 0;
            return dateA - dateB; // Sort in chronological order (oldest first)
          });
  
        this.filteredSchoolList = [...this.schoolList];
      },
      error: (err: any) => {
        console.error('Error fetching schools:', err);
      },
    });
  }
  
  fetchOrganizations(): void {
    this.schoolService.getSelectedOrganization().subscribe({
      next: (response: any) => {
        this.organizationList = response.organizations.map((org: any) => ({
          id: org.organization_id,
          name: org.organization_name,
        }));
      },
      error: (err: any) => {
        console.error('Error fetching organizations:', err);
      },
    });
  }

  navigateToaddschool(): void {
    const dialogRef = this.dialog.open(AddSchoolComponent, {
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('New school added:', result);
        
        // Option 1: Directly update the list
        this.schoolList.push(result);
        this.filteredSchoolList = [...this.schoolList]; // Refresh UI instantly
  
        // Option 2: Fetch latest data from backend after a short delay
        timer(1000).subscribe(() => this.fetchSchools());
      }
    });
  }

  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredSchoolList = this.schoolList.filter(
      (school) =>
        school.school_name.toLowerCase().includes(query) ||
        school.address.toLowerCase().includes(query) ||
        school.email.toLowerCase().includes(query) ||
        school.contact_no.includes(query)
    );
  }

  openEditDialog(school: any = null): void {
    this.selectedSchool = school
      ? { ...school }
      : {
          school_name: '',
          address: '',
          email: '',
          contact_no: '',
          no_of_teachers: 0,
          organization_id: '',
        };
    
    this.originalSchoolData = { ...this.selectedSchool }; // Save the original data for comparison
    this.dialog.open(this.editDialog, { width: '400px' });
  }

  saveSchool(): void {
    // Create an object to store only the changed fields
    const changes: any = {};
  
    // Compare original data with current data to detect changes
    Object.keys(this.selectedSchool).forEach((key) => {
      // Only add the key to 'changes' if its value has changed
      if (this.selectedSchool[key] !== this.originalSchoolData[key]) {
        changes[key] = this.selectedSchool[key];
      }
    });
  
    // Log the detected changes
    console.log('Detected changes:', changes);
  
    // If there are no changes, exit early
    if (Object.keys(changes).length === 0) {
      console.log('No changes detected.');
      this.closeDialog();
      return;
    }
  
    // Prepare the URL and send only the changed fields
    const schoolId = this.selectedSchool.id;
  
    // Prepare query parameters from the changes object
    let params = new HttpParams();  // Change from 'const' to 'let'
    
    // Send the fields as per the correct query parameter names
    Object.keys(changes).forEach(key => {
      if (key === 'school_name') {
        params = params.append('school_name', changes[key]);
      } else if (key === 'email') {
        params = params.append('email', changes[key]);
      } else if (key === 'contact_no') {
        params = params.append('ph_no', changes[key]); // map 'contact_no' to 'ph_no'
      } else if (key === 'address') {
        params = params.append('addr', changes[key]); // map 'address' to 'addr'
      } else if (key === 'organization_id') {
        params = params.append('organization_id', changes[key]);
      }
    });
  
    console.log('Sending changes to backend:', params);
  
    // Send the PATCH request with only the changed data as query parameters
    if (schoolId) {
      this.schoolService.updateSchool(schoolId, params).subscribe({
        next: () => {
          console.log('School updated successfully');
          this.fetchSchools();
          this.showPopup('School updated successfully', 'success');
          this.closeDialog();
          
        },
        error: (err: any) => {
          console.error('Error updating school:', err);
        },
      });
    }
  }
  
  onDeleteSchool(school: any): void {
    this.selectedSchool = school; // Set the selected school
    const dialogRef = this.dialog.open(this.deleteConfirmDialog, { width: '400px' });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.confirmDelete(); // Call confirmDelete after confirmation
      }
    });
  }

  confirmDelete(): void {
    if (!this.selectedSchool || !this.selectedSchool.id) {
      console.error('No school selected for deletion.');
      return;
    }
  
    this.schoolService.deleteSchool(this.selectedSchool.id).subscribe({
      next: () => {
        this.fetchSchools(); // Refresh the school list
        this.showPopup('Deleted successfully', 'success'); // Show success message
        this.closeDialog(); // Close the dialog box
      },
      error: (err: any) => {
        console.error('Error deleting school:', err);
        this.showPopup('Error deleting school. Please try again.', 'error'); // Show error message
      },
    });
  }
  

  closeDialog(): void {
    this.dialog.closeAll();
  }
  capitalizeFirstLetter(str: string): string {
    return str
      ? str
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : '';
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
  
}