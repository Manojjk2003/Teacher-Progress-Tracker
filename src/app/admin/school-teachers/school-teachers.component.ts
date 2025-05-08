import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service'; // Import the shared service
import { SchoolTeachersService } from './school-teachers.service'; // Import the service to fetch teachers
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common'; // Import Location service for back navigation

// Define the Teacher interface for better type safety
interface Teacher {
  teacher_id: string;
  teacher_name: string;
  email: string;
  contact_no: string;
  number_of_students: number;
  school_address: string;
  school_contact_no: string;
  school_name : string;
}

@Component({
  selector: 'app-school-teachers',
  templateUrl: './school-teachers.component.html',
  styleUrls: ['./school-teachers.component.css'],
  imports: [CommonModule, MatCardModule,MatIconModule, RouterLink]
})
export class SchoolTeachersComponent implements OnInit {
  
  teachers: Teacher[] = [];
  schoolId: string | null = null;
  organizationName: string | null = null;
  schoolName: string | null = null;

  constructor(
    private sharedService: SharedService, 
    private schoolTeachersService: SchoolTeachersService, 
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Get Organization Name from Shared Service
    const orgDetails = this.sharedService.getSelectedOrganization();
    this.organizationName = orgDetails.name;

    // Get School ID from Shared Service
    this.schoolId = this.sharedService.getSchoolId();
    console.log('School ID in component:', this.schoolId);

    if (this.schoolId) {
      this.fetchTeachers(this.schoolId);
    }
  }

  fetchTeachers(schoolId: string): void {
    this.schoolTeachersService.getTeachersBySchool(schoolId).subscribe(
      (response) => {
        this.teachers = response.teachers.map((teacher: any) => ({
          teacher_id: teacher.teacher_id,
          teacher_name: teacher.teacher_name,
          email: teacher.email,
          contact_no: teacher.contact_no,
          number_of_students: teacher.number_of_students,
          school_address: teacher.school_address,
          school_contact_no: teacher.school_contact_no,
          school_name: teacher.school_name,
        })) as Teacher[];

        // Set the school name dynamically from the first teacher (if available)
        if (this.teachers.length > 0) {
          this.schoolName = this.teachers[0].school_name;
        }
      },
      (error) => {
        console.error('Error fetching teachers:', error);
      }
    );
  }



  capitalizeFirstLetter(str: string): string {
    return str
      ? str
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : '';
  }

  navigateToTeacherDashboard(teacherId: string): void {
    this.sharedService.setTeacherId(teacherId); // Store teacher ID
    this.router.navigate(['admin-navbar/admin-teacherdashboard']); // Navigate to the teacher dashboard
  }

}
