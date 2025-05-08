import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserdetailsService } from './userdetails.service';

@Component({
  selector: 'app-userdetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {
  userProfile: any = {}; // Store profile data
  isLoading: boolean = true; // Flag to show loading state
  isEditMode: boolean = false; // Flag for edit mode
  userId: string = ''; // User ID for API calls

  constructor(
    private authService: AuthService,
    private profileService: UserdetailsService
  ) {}

  ngOnInit() {
    // Subscribe to AuthService to get the current user's UID
    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.uid) {
        this.userId = user.uid; // Fetch UID from the authenticated user
        console.log('User ID:', this.userId);

        // Fetch profile data using the UID
        this.loadUserProfile();
      } else {
        console.error('User not authenticated.');
        this.isLoading = false; // Stop loading if no user
      }
    });
  }

  // Load user profile data
  private loadUserProfile() {
    this.profileService.getUserProfile(this.userId).subscribe({
      next: (data) => {
        this.userProfile = data;
        console.log('Profile data:', data);
        this.isLoading = false; // Stop loading when data is fetched
      },
      error: (err) => {
        console.error('Error fetching profile data:', err);
        this.isLoading = false;
      }
    });
  }

  // Enable edit mode
  editProfile() {
    this.isEditMode = true;
  }

  // Save updated profile data
  saveProfile() {
    if (this.userId && this.userProfile) {
      this.profileService.updateUserProfile(this.userId, this.userProfile).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.isEditMode = false;
        },
        error: (err) => {
          console.error('Error updating profile:', err);
        }
      });
    }
  }

  // Cancel edit mode and reload original data
  cancelEdit() {
    this.isEditMode = false;
    this.loadUserProfile();
  }

  // Capitalize the first letter of a string
  capitalizeName(name: string): string {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}
