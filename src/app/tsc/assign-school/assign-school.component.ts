import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AssignSchoolService } from './assign-school.service';
import { SharedService } from '../shared.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-school',
  templateUrl: './assign-school.component.html',
  styleUrls: ['./assign-school.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,RouterLink
  ],
})
export class AssignSchoolComponent implements OnInit {
  schools: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  organizationName: string = '';

  constructor(
    private router: Router,
    private assignSchoolService: AssignSchoolService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const organization = this.sharedService.getSelectedOrganization();
    this.organizationName = organization.name || 'Organization Name Not Set'; // Fallback if the name is not set
    let tscId = this.sharedService.getUserId();
    
  
    // If TSC ID is not set in SharedService, handle fallback
    if (!tscId) {
      console.warn('TSC ID not found in SharedService. Attempting fallback...');
      
      // Example fallback: fetch from sessionStorage or another source
      tscId = sessionStorage.getItem('tscId') || null;
      if (tscId) {
        console.log('TSC ID retrieved from fallback (e.g., sessionStorage):', tscId);
        this.sharedService.setUserId(tscId); // Save back to SharedService
      }
    }
  
    if (tscId) {
      console.log('Retrieved TSC ID in AssignSchoolComponent:', tscId); // Debug log
      this.fetchAssignedSchools(tscId);
    } else {
      console.error('TSC ID not found in SharedService or fallback.');
      this.error = 'Failed to load assigned schools. Please try again later.';
      this.loading = false;
    }
  }
  capitalizeFirstLetter(str: string): string {
    return str
      ? str
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : '';
  }
  

  private fetchAssignedSchools(tscId: string): void {
    this.assignSchoolService.getAssignedSchools(tscId).subscribe({
      next: (data) => {
        this.schools = data.schools || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching assigned schools:', err);
        this.error = 'Failed to load assigned schools. Please try again later.';
        this.loading = false;
      },
    });
  }

  navigateToAssignTeacher(schoolId: string): void {
    this.sharedService.setSchoolId(schoolId); // Set the school ID in the shared service
    this.router.navigate(['tsc-navbar/assign-teacher']); // Navigate to the assign teacher component
  }
}
