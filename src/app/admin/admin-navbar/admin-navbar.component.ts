import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common'; // Import Location service for back navigation
import { RouterModule } from '@angular/router'; // Import RouterModule for router-outlet
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { AuthService } from '../../../services/auth.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule], // Add CommonModule here
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'] // Corrected to use 'styleUrls'
})
export class AdminNavbarComponent implements OnInit {
  badgevisible = false;
  dropdownActive = false; // Tracks the profile dropdown visibility
  sidebarHidden = true;
  userId: string | null = null; // Tracks the sidebar visibility

  showBackButton: boolean = true; // Flag to control back button visibility

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute ,
    private authService: AuthService,
     private sharedService: SharedService
    // Inject ActivatedRoute service
  ) {}

 
    ngOnInit(): void {
      // Only apply pushState on login redirection.
      if (this.router.url === '/admin-dashboard') {
        history.replaceState({}, '', '/admin-dashboard');
      }
    
      this.router.events.subscribe(() => {
        const currentUrl = this.router.url;
      
        // Prevent back navigation to login when in protected routes
        if (currentUrl.includes('admin-dashboard') || currentUrl.includes('finalPage')) {
          this.showBackButton = false;
          history.pushState(null, '', currentUrl); // Prevent browser back to login
        } else {
          this.showBackButton = true; // Show back button for other pages
        }
      });
    
      // Handle browser back button only for the login route
      window.addEventListener('popstate', () => {
        if (this.router.url === '/login') {
          this.router.navigate(['/admin-dashboard']); // Redirect to dashboard instead of login
          history.pushState(null, '', '/admin-dashboard'); // Force the user to stay on dashboard
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

  // Logout functionality
  logout() {
    localStorage.clear(); 

    // Clear authentication details
    localStorage.removeItem('userId'); // Remove stored userId
    localStorage.removeItem('authToken'); // If you have a token stored, remove it
  
    // Call logout function from AuthService (if any additional cleanup is needed)
    this.authService.logout();
  
    // Navigate to login and force a full reload to clear session state
    this.router.navigate(['/login']).then(() => {
      window.location.href = '/login'; // Ensures complete page reload
    });
  }
  

  

  // Back button functionality (will do nothing if masked)
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