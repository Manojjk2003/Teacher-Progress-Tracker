import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';  // Import MatIconModule
import { 
  trigger, 
  state, 
  style, 
  animate, 
  transition,
  query,
  stagger
} from '@angular/animations';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  passwordVisible: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  private apiUrl = 'http://api.kiddypi.com:8003';
  //  // API URL

  constructor(
    private auth: Auth,
    private http: HttpClient,
    private router: Router
  ) {}

  // ... rest of your existing methods remain the same ...



  // async onLogin() {
  //   this.clearMessages();

  //   if (!this.email || !this.password) {
  //     this.errorMessage = 'Please enter both email and password.';
  //     return;
  //   }

  //   this.isLoading = true;

  //   try {
  //     // Firebase login
  //     const userCredential = await signInWithEmailAndPassword(
  //       this.auth,
  //       this.email,
  //       this.password
  //     );
  //     const user = userCredential.user;

  //     if (user) {
  //       await this.fetchUserRole(user.uid); // Call API to fetch role
  //     }
  //   } catch (error: any) {
  //     console.error('Error during login:', error);
  //     this.errorMessage = error.message || 'An unexpected error occurred.';
  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

  async onLogin() {
  this.clearMessages();

  if (!this.email || !this.password) {
    this.errorMessage = 'Please enter both email and password.';
    return;
  }

  this.isLoading = true;

  try {
    // Firebase login
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      this.email,
      this.password
    );
    const user = userCredential.user;

    if (user) {
      localStorage.setItem('userId', user.uid);
      await this.fetchUserRole(user.uid); // Call API to fetch role
    }
  } catch (error: any) {
    console.error('Error during login:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));

    // Use error.code if available; otherwise, check other properties
    const errorCode = error?.code || error?.message || '';

    if (errorCode.includes('auth/user-not-found')) {
      this.errorMessage = 'User not found. Please check your email.';
    } else if (errorCode.includes('auth/wrong-password')) {
      this.errorMessage = 'Incorrect password. Please try again.';
    } else if (errorCode.includes('auth/invalid-email')) {
      this.errorMessage = 'Invalid email format.';
    } else if (errorCode.includes('auth/user-disabled')) {
      this.errorMessage = 'Your account has been disabled. Contact support.';
    } else {
      this.errorMessage = 'Incorrect Email_Id or password. Please check.';
    }
  } finally {
    this.isLoading = false;
  }
}


  // Function to toggle the visibility of the password
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  

  private fetchUserRole(uid: string) {
    this.http
      .get<{ users_id: string; email: string; role: string }>(
        `${this.apiUrl}/get-user/${uid}`
      )
      .subscribe({
        next: (response) => {
          if (response?.role) {
            this.redirectBasedOnRole(response.role);
          } else {
            this.errorMessage = 'User role not found.';
          }
        },
        error: (error) => {
          console.error('Error fetching user role:', error);
          this.handleApiError(error);
        },
      });
  }

  private redirectBasedOnRole(role: string) {
    const routes: { [key: string]: string } = {
      admin: '/admin-navbar',
      tsc: '/tsc-navbar',
      teacher: '/teacher-navbar',
    };

    const route = routes[role];
    if (route) {
      this.router.navigate([route]);
    } else {
      this.errorMessage = 'User role not defined.';
    }
  }

  private handleApiError(error: any) {
    if (error.status === 404) {
      this.errorMessage = 'User not found. Please check your credentials.';
    } else if (error.status === 500) {
      this.errorMessage = 'Server error. Please try again later.';
    } else {
      this.errorMessage = 'An unexpected error occurred.';
    }
  }

  private clearMessages() {
    this.errorMessage = null;
    this.successMessage = null;
  }

  async onForgotPassword() {
    this.clearMessages();

    if (!this.email) {
      this.errorMessage = 'Please enter your email to reset your password.';
      return;
    }

    this.isLoading = true;

    try {
      await sendPasswordResetEmail(this.auth, this.email);
      this.successMessage =
        'Password reset email sent. Please check your inbox.';
    } catch (error: any) {
      console.error('Error during password reset:', error);
      this.errorMessage =
        'Failed to send password reset email. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
