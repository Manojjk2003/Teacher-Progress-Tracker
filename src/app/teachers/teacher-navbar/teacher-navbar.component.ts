import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../teacher-dashboard/teacher-dashboard.service'; // Correct path for the service
import { AuthService } from '../../../services/auth.service'; // Correct path for AuthService
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common'; // Import Location for navigation
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-navbar',
  standalone: true,
  templateUrl: './teacher-navbar.component.html', // Corrected to templateUrl
  styleUrls: ['./teacher-navbar.component.css'],
  imports: [RouterModule, RouterLink, MatIconModule, CommonModule, ReactiveFormsModule ] // Added CommonModule here
})
export class TeacherNavbarComponent implements OnInit {
  badgevisible = false;
  sidebarHidden: boolean = true;
  dropdownActive = false; // Tracks the profile dropdown visibility
  schoolName: string = ''; // To store fetched school name
  userId: string = ''; // To store the current user ID
  showBackButton: boolean = true; // Flag to control back button visibility

  constructor(
    private router: Router, 
    private dashboardService: DashboardService, // Inject DashboardService
    private authService: AuthService, // Inject the AuthService to get the current user
    private location: Location // Inject Location for navigation
  ) {}
  ngOnInit(): void {
    // Subscribe to router events to check the current route and control back button visibility
    if (this.router.url === '/admin-dashboard') {
      history.replaceState({}, '', '/admin-dashboard');
    }
  
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
    
      // Prevent back navigation to login when in protected routes
      if (currentUrl.includes('teacher-dashboard') || currentUrl.includes('finalPage')) {
        this.showBackButton = false;
        history.pushState(null, '', currentUrl); // Prevent browser back to login
      } else {
        this.showBackButton = true; // Show back button for other pages
      }
    });
  
    // Handle browser back button only for the login route
    window.addEventListener('popstate', () => {
      if (this.router.url === '/login') {
        this.router.navigate(['/teacher-dashboard']); // Redirect to dashboard instead of login
        history.pushState(null, '', '/teacher-dashboard'); // Force the user to stay on dashboard
      }
    });
  
    // Fetch the current user
    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.uid) {
        this.userId = user.uid; // Store the user ID
        if (this.userId) {
          // Fetch dashboard data using DashboardService
          this.dashboardService.getDashboardData(this.userId).subscribe({
            next: (data) => {
              // Assuming the data is in the structure where school_name is available directly
              if (data && data.school_name) {
                this.schoolName = data.school_name; // Append "School" to the name
              } else {
                this.schoolName = 'Unknown School'; // Fallback message if school_name is not present
              }
            },
            error: (err) => {
              console.error('Error fetching school name:', err);
              this.schoolName = 'Error Fetching School'; // Fallback message in case of error
            },
          });
        }
      }
    });
  }
  
  get currentUrl(): string {
    return this.router.url;
  }


// Toggle badge visibility
badgevisibility() {
  this.badgevisible = false;
}
  // Toggle sidebar visibility (including quick links)
  toggleSidebar(): void {
    this.sidebarHidden = !this.sidebarHidden; // Reverse the current state
  }

  // Toggle dropdown visibility
  toggleDropdown() {
    this.dropdownActive = !this.dropdownActive;
  }

  goBack(): void {
    if (!this.showBackButton) {
      return; // Do nothing if back button is masked
    }
    this.location.back(); // Navigate back to the previous page
  }

  // Logout and redirect to login page
  logout() {
    localStorage.clear(); 

    // Clear authentication details
    localStorage.removeItem('userId'); // Remove stored userId
    localStorage.removeItem('authToken'); // Clear user session or token
    this.router.navigate(['/login']); // Navigate to login page
  }

  // Check if the screen size is mobile
  collapseSidebar() {
    if (window.innerWidth <= 768) { // Only collapse on mobile screens
      this.sidebarHidden = true;
    }
  }
}
