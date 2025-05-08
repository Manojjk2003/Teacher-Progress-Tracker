import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { EvalutionService } from './evalution.service'; // Import the service
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../shared.service'; // Import the shared service

@Component({
  selector: 'app-evalution',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, RouterLink],
  templateUrl: './evalution.component.html',
  styleUrls: ['./evalution.component.css']
})
export class EvalutionComponent implements OnInit {
  schoolList: any[] = [];
  filteredSchoolList: any[] = [];
  searchQuery: string = '';
  organizationName: string = ''; // To store the organization name

  constructor(
    private evalutionService: EvalutionService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const { id: organizationId, name: organizationName } = this.sharedService.getSelectedOrganization();

    if (organizationId) {
      this.organizationName = organizationName || ''; // Retrieve the organization name
      this.fetchSchools(organizationId); // Fetch schools for the selected organization
    } else {
      console.error('No organization selected!');
    }
  }

  fetchSchools(organizationId: string): void {
    this.evalutionService.getSchoolsByOrganization(organizationId).subscribe(
      (response) => {
        console.log('Fetched Schools:', response);
        if (response && response.schools) {
          this.schoolList = response.schools;
          this.filteredSchoolList = [...this.schoolList];
        } else {
          console.warn('No schools found in response');
        }
      },
      (error) => {
        console.error('Error fetching schools:', error);
      }
    );
  }

  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredSchoolList = this.schoolList.filter(
      (school) =>
        school.school_name?.toLowerCase().includes(query) ||
        school.email?.toLowerCase().includes(query) ||
        school.contact_no?.toLowerCase().includes(query)
    );
  }

  navigateToAssignTeacher(schoolId: string): void {
    if (!schoolId) {
      console.error('Invalid School ID:', schoolId);
      return;
    }
    this.sharedService.setSchoolId(schoolId);
    this.router.navigate(['admin-navbar/school-teachers']);
  }

  capitalizeFirstLetter(str: string): string {
    return str
      ? str
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : '';
  }
}
