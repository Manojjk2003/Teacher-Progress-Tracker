import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { AssignTeacherService } from './assign-teacher.service';
import { SharedService } from '../shared.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../admin/teacher/teacher.service';

@Component({
  selector: 'app-assign-teacher',
  standalone: true,
  templateUrl: './assign-teacher.component.html',
  styleUrls: ['./assign-teacher.component.css'],
  imports: [
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTableModule,
    CommonModule,RouterLink
  ],
})
export class AssignTeacherComponent implements OnInit {
  @ViewChild('projectDialog') projectDialog!: TemplateRef<any>; 
  dialogRef: any; 
  teachers: any[] = []; // Array to hold teacher data
  organizationName: string = '';
  schoolName: string = '';


  constructor(
    private router: Router, 
    private teacherService: AssignTeacherService, 
    private sharedService: SharedService // Inject the shared service
  ) {}

  ngOnInit(): void {
    // Retrieve organization and school names from the shared service
    const organization = this.sharedService.getSelectedOrganization();
    this.organizationName = organization.name || 'Organization Name Not Set'; // Fallback if organization name is not set
    
    const schoolId = this.sharedService.getSchoolId(); // Get the school ID from the shared service
    if (schoolId) {
      // Retrieve school name from the shared service (you could fetch this from an API if needed)
      const school = this.teachers.find(teacher => teacher.schoolName); // Assuming the first teacher has the school name
      this.schoolName = school ? school.schoolName : 'School Name Not Set';
      
      this.loadTeachers(schoolId); // Call method to load teacher data
    } else {
      console.error('No school ID found.');
    }
  }

  // Method to load teacher data
  private loadTeachers(schoolId: string): void {
    this.teacherService.getTeachersBySchool(schoolId).subscribe({
      next: (response) => {
        // Directly map each teacher's school name from their respective object
        this.teachers = response.teachers.map((teacher: any) => ({
          id: teacher.teacher_id,
          name: teacher.teacher_name,
          schoolName: teacher.school_name, // Directly from the teacher object
          contactNo: teacher.contact_no,
          email: teacher.email,
          gender: teacher.gender,
        }));
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      },
    });
  }
  
  

  // Method to navigate to the teacher dashboard
  navigateToTeacherDashboard(teacherId: string): void {
    console.log('Navigating to teacher dashboard for ID:', teacherId); // Debug log
    this.sharedService.setTeacherId(teacherId); // Set the teacher ID in shared service
    this.router.navigate(['tsc-navbar/tsc-teacherdashboard']); // Navigate to the teacher dashboard
  }

  // Method to capitalize the first letter of a string
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Method to format the school name to uppercase
  formatSchoolName(schoolName: string | undefined): string {
    return schoolName ? schoolName.toUpperCase() : 'No School Name';
  }
}
