import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
 // Import Location service for back navigation


@Component({
  selector: 'app-tsc-navbar',
  imports: [RouterOutlet, RouterLink,MatIconModule,CommonModule, ReactiveFormsModule],
  templateUrl: './tsc-navbar.component.html',
  styleUrl: './tsc-navbar.component.css'
})
export class TscNavbarComponent {
  badgevisible = false;
  dropdownActive = false; // Tracks the profile dropdown visibility
  sidebarHidden = true; // Tracks the sidebar visibility

  showBackButton: boolean = true; // Flag to control back button visibility

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute // Inject ActivatedRoute service
  ) {}

  ngOnInit(): void {
    // Subscribe to router events to check if back button should be shown
    if (this.router.url === '/admin-dashboard') {
      history.replaceState({}, '', '/admin-dashboard');
    }
  
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
    
      // Prevent back navigation to login when in protected routes
      if (currentUrl.includes('tsc-dashboard') || currentUrl.includes('finalPage')) {
        this.showBackButton = false;
        history.pushState(null, '', currentUrl); // Prevent browser back to login
      } else {
        this.showBackButton = true; // Show back button for other pages
      }
    });
  
    // Handle browser back button only for the login route
    window.addEventListener('popstate', () => {
      if (this.router.url === '/login') {
        this.router.navigate(['/tsc-dashboard']); // Redirect to dashboard instead of login
        history.pushState(null, '', '/tsc-dashboard'); // Force the user to stay on dashboard
      }
    });
  }
  

  get currentUrl(): string {
    return this.router.url;
  }

  // Toggle badge visibility
  badgevisibility() {
    this.badgevisible = true;
  }

  // Toggle sidebar visibility
  toggleSidebar() {
    this.sidebarHidden = !this.sidebarHidden;
  }

  // Function to toggle the dropdown menu
  toggleDropdown() {
    this.dropdownActive = !this.dropdownActive;
  }

  logout() {
    // Clear user session or token
    localStorage.clear(); 

    // Clear authentication details
    localStorage.removeItem('userId'); // Remove stored userId
    localStorage.removeItem('authToken');  // Example: remove user token from localStorage
    this.router.navigate(['/login']); // Navigate to login page
  }
  goBack(): void {
        if (!this.showBackButton) {
          return; // Do nothing if back button is masked
        }
        this.location.back(); // Navigate back to the previous page
      }
    
      // Collapse sidebar when a link is clicked
      collapseSidebar() {
        if (window.innerWidth <= 768) { // Only collapse on mobile screens
          this.sidebarHidden = true;
        }
      }
}