import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AddTeachersService } from './add-teachers.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-teacher',
  standalone: true,
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,MatNativeDateModule,MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class AddTeacherComponent implements OnInit {
  teacher = {
    name: '',
    email: '',
    organizationId: '', // New field for organization
    schoolId: '',
    phoneNumber: '',
    numberOfStudents: '',
    classes: '',
    dateOfBirth: '',
    gender: '',
    age: ''
  };
  
  organizations: { id: string; organization_name: string }[] = [];
  schools: { id: string; school_name: string }[] = [];
  

  constructor(
    private authService: AuthService,
    private teacherService: AddTeachersService,
    private dialogRef: MatDialogRef<AddTeacherComponent> // Injecting Dialog Reference
  ) {}

  ngOnInit(): void {
    this.fetchOrganizations();
  }
  
  // Fetch Organizations
  fetchOrganizations() {
    this.teacherService.getOrganizations().subscribe(
      (response) => {
        if (response && response.organizations) {
          this.organizations = response.organizations.map((org: any) => ({
            id: org.organization_id,
            organization_name: org.organization_name
          }));
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching organizations:', error);
      }
    );
  }
  
  // fetchSchools() {
  //   this.teacherService.getSchools().subscribe(
  //     (response) => {
  //       if (response && response.schools) {
  //         this.schools = response.schools.map((school: any) => ({
  //           id: school.School_id,
  //           school_name: school.school_name
  //         }));
  //       } else {
  //         console.error('Unexpected response format:', response);
  //         // alert('Failed to fetch schools. Unexpected response format.');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching schools:', error);
  //       // alert('Failed to fetch schools. Please try again.');
  //     }
  //   );
  // }

  onOrganizationChange() {
    console.log("Selected Organization ID:", this.teacher.organizationId);
  
    if (this.teacher.organizationId) {
      this.teacherService.getSchoolsByOrganization(this.teacher.organizationId).subscribe(
        (response) => {
          console.log("Fetched Schools Response:", response); // Debugging step
  
          if (response && response.schools) {
            this.schools = response.schools.map((school: any) => ({
              id: school.school_id || school.id, // Fix potential mismatch
              school_name: school.school_name
            }));
  
            console.log("Updated Schools List:", this.schools); // Check if schools list is populated
          } else {
            console.error('Unexpected response format:', response);
            this.schools = []; // Reset if response is unexpected
          }
        },
        (error) => {
          console.error('Error fetching schools:', error);
          this.schools = [];
        }
      );
    } else {
      this.schools = []; // Clear schools if no organization is selected
    }
  }
  

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
  

  onSubmit(form?: any) {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.uid) {
        console.log('Current User UID:', user.uid);
  
        let params = new HttpParams()
          .set('name', this.teacher.name)
          .set('email', this.teacher.email)
          .set('school_id', this.teacher.schoolId)
          .set('phone_number', this.teacher.phoneNumber)
          .set('number_of_students', this.teacher.numberOfStudents);
  
        if (this.teacher.classes) params = params.set('classes', this.teacher.classes);
        if (this.teacher.dateOfBirth) params = params.set('date_of_birth', this.teacher.dateOfBirth);
        if (this.teacher.gender) params = params.set('gender', this.teacher.gender);
        if (this.teacher.age) params = params.set('age', this.teacher.age);
  
        this.teacherService.addTeacher(user.uid, params).subscribe(
          (response) => {
            console.log('Teacher added successfully:', response);
            
            // Show success message
            this.showPopup('Teacher added successfully!', 'success');
  
            // Close dialog immediately
            this.dialogRef.close(true);
  
            // Reset form after closing the dialog (if form exists)
            if (form) {
              form.reset();
              Object.keys(form.controls).forEach((key) => {
                form.get(key)?.markAsPristine();
                form.get(key)?.markAsUntouched();
              });
            }
          },
          (error) => {
            console.error('Error adding teacher:', error);
  
            // Show error messages
            if (error.status === 422) {
              this.showPopup('Validation failed: ' + JSON.stringify(error.error.detail), 'error');
            } else {
              this.showPopup('Failed to add teacher. Please try again.', 'error');
            }
          }
        );
      } else {
        console.warn('User is not authenticated');
        this.showPopup('User authentication failed. Please log in again.', 'error');
      }
    });
  }
  
  onCancel(event?: Event): void {
    if (event) {
      event.preventDefault(); // Prevent form submission
      event.stopPropagation(); // Stop event bubbling
    }
    this.dialogRef.close(false); // Close the dialog
  }
  

  

  showPopup(message: string, type: 'success' | 'error') {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.fontSize = '20px';
    popup.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '1000';

    if (type === 'success') {
      popup.style.backgroundColor = 'green';
      popup.style.color = 'white';
    } else {
      popup.style.backgroundColor = 'red';
      popup.style.color = 'white';
    }

    document.body.appendChild(popup);
    setTimeout(() => document.body.removeChild(popup), 2000);
  }
}