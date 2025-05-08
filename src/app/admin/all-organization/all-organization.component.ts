import { Component, OnInit } from '@angular/core';
import { AllOrganizationService } from './all-organization.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-organization',
  templateUrl: './all-organization.component.html',
  styleUrls: ['./all-organization.component.css'],
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule, FormsModule],
})
export class AllOrganizationComponent implements OnInit {
  organizations: any[] = [];  // Store the organizations here
  isLoading = true;           // Show a loading spinner while data is being fetched
  errorMessage: string | null = null;  // Store error messages if any

  constructor(
    private organizationService: AllOrganizationService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchOrganizations();
  }

  // Method to fetch organizations
  fetchOrganizations(): void {
    this.organizationService.getOrganizations().subscribe(
      (data) => {
        this.organizations = data.organizations;  // Assuming your API response has a "organizations" field
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load organizations'; // Handle error
        this.isLoading = false;
      }
    );
  }

  // Navigate to evaluation page and store organization details in shared service
 // Navigate to evaluation page and store organization details in shared service
navigateToEvaluation(org: any): void {
  const organizationId = org.organization_id;
  const organizationName = org.organization_name; // Assuming this is part of the organization object
  this.sharedService.setSelectedOrganization(organizationId, organizationName); // Save ID and name in shared service
  this.router.navigate(['admin-navbar/evalution']); // Navigate to evaluation page
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
