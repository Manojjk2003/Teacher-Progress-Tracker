import { Component, OnInit } from '@angular/core';
import { AssignOrganizationService } from './assign-organization.service';
import { SharedService } from '../shared.service'; // Import SharedService
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assign-organization',
  imports: [MatCardModule, CommonModule],
  templateUrl: './assign-organization.component.html',
  styleUrls: ['./assign-organization.component.css'],
})
export class AssignOrganizationComponent implements OnInit {
  organization: any = null; // To store organization details
  isLoading = true; // For showing a loader
  errorMessage: string | null = null; // For error messages
  loading: boolean = true;
  error: string | null = null;
  organizations: any[] = [];

  constructor(
    private assignOrganizationService: AssignOrganizationService,
    private sharedService: SharedService, // Inject SharedService
    private router: Router,
  ) {}

  ngOnInit(): void {
    
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
      this.fetchOrganization(tscId);
    } else {
      console.error('TSC ID not found in SharedService or fallback.');
      this.error = 'Failed to load assigned schools. Please try again later.';
      this.loading = false;
    }
  }
  
  // Fetch the organization details by TSC ID
  fetchOrganization(tscId: string): void {
    this.assignOrganizationService.getOrganizationByTsc(tscId).subscribe(
      (response) => {
        this.organization = response.organization;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = error.error.detail || 'Error fetching organization details';
        this.isLoading = false;
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
  navigateToEvaluation(org: any): void {
    const organizationId = org.organization_id;
    const organizationName = org.organization_name; // Assuming this is part of the organization object
    this.sharedService.setSelectedOrganization(organizationId, organizationName); // Save ID and name in shared service
    this.router.navigate(['tsc-navbar/assign-school']); // Navigate to evaluation page
  }
}
