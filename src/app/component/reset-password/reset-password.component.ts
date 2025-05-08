import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import zxcvbn from 'zxcvbn';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Import necessary modules for ngModel and forms
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  currentPassword: string = ''; 
  newPassword: string = ''; 
  confirmPassword: string = ''; 
  errorMessage: string | null = null;
  successMessage: string | null = null;
  passwordStrength: string = ''; 
  passwordScore: number = 0; 
  passwordError: string | null = null; // Error message for validation

  constructor(private auth: Auth, private router: Router) {}

  // Check password strength and validation
  checkPasswordStrength() {
    const password = this.newPassword;
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      this.passwordError = 'Password must be at least 6 characters long.';
    } else if (!hasUpperCase) {
      this.passwordError = 'Password must contain at least one uppercase letter.';
    } else if (!hasLowerCase) {
      this.passwordError = 'Password must contain at least one lowercase letter.';
    } else if (!hasNumber) {
      this.passwordError = 'Password must contain at least one number.';
    } else if (!hasSpecialChar) {
      this.passwordError = 'Password must contain at least one special character.';
    } else {
      this.passwordError = null;
    }

    // Use zxcvbn for strength calculation
    const result = zxcvbn(password);
    this.passwordScore = result.score;
    this.passwordStrength = this.getStrengthLabel(this.passwordScore);
  }

  getStrengthLabel(score: number): string {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  }

  async onResetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    if (this.passwordError) {
      this.errorMessage = 'Please fix the password requirements.';
      return;
    }

    const user = this.auth.currentUser;
    if (!user) {
      this.errorMessage = 'User not logged in. Please log in and try again.';
      return;
    }

    const email = user.email;
    if (!email) {
      this.errorMessage = 'User email not found. Please contact support.';
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(email, this.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, this.newPassword);

      this.successMessage = 'Password has been successfully reset!';
      this.errorMessage = null;

      // Redirect after success
      // this.router.navigate(['admin-navbar/admin-dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to reset password. Please try again later.';
      console.error('Error resetting password:', error);
    }
  }
}
