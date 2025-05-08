import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Required for *ngFor
import { TscService } from '../tsc/tsc.service';
import { AuthService } from '../../../services/auth.service'; // Import AuthService
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tsc-form',
  standalone: true,
  templateUrl: './tsc-form.component.html',
  styleUrls: ['./tsc-form.component.css'],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class TSCFormComponent implements OnInit {
 
    tscForm!: FormGroup;
    schools: any[] = [];
    currentUserSubscription!: Subscription;
    currentUserId: string | null = null;
    tscId: string | null = null; // Declare tscId as string | null
    formTitle: string = 'Add TSC Details'; // Initialize with 'Add TSC' by default
    isEditMode: boolean = false;
  tscData: any = {
    tsc_name: '',
    email: '',
    phone_number: '',
    schools_handled: []
  };

  
    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<TSCFormComponent>,
      private tscService: TscService,
      private authService: AuthService, // Inject AuthService
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      if (data) {
        this.isEditMode = true;
        this.tscData = { ...data }; // Copy data to avoid mutations
      }
    }

  ngOnInit() {
    this.initializeForm();

    // Subscribe to the current user observable to get user information
    this.currentUserSubscription = this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUserId = user.uid; // Store user UID when available
      }
    });

    // Fetch school options first and then fetch TSC details
    this.fetchSchools().then(() => {
      if (this.data && this.data.tsc_id) {
        this.tscId = this.data.tsc_id;
        this.formTitle = 'Edit TSC Details'; // Change title to "Edit" if tscId exists
        if (this.tscId) {
          this.fetchTscDetails(this.tscId); // Fetch TSC details after schools are loaded
        }
      } else {
        console.warn('No TSC ID provided in dialog data');
      }
    });
  }

  initializeForm() {
    this.tscForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      emailId: [
        '',
        [
          Validators.required, 
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/) // Gmail validation
        ]
      ],
      phone_number: [
        '', 
        [Validators.required, Validators.pattern('^[0-9]{10}$')] // Phone number validation
      ],
      gender: ['', Validators.required],
      school_id: ['', Validators.required],
    });
  }
  
  
  fetchTscDetails(tscId: string) {
    if (!tscId) {
      console.warn('No TSC ID provided. Skipping fetchTscDetails.');
      return;
    }

    this.tscService.getTscDetails(tscId).subscribe(
      (response) => {
        if (response && response.tsc) {
          console.log('TSC details fetched:', response.tsc);

          // Loop through schools_handled and find the corresponding school_id
          const school = this.schools.find(school => response.tsc.schools_handled.includes(school.viewValue));

          if (this.tscForm) {
            this.tscForm.patchValue({
              name: response.tsc.tsc_name || '',
              emailId: response.tsc.email || '',
              phone_number: response.tsc.phone_number || '',
              gender: response.tsc.gender || '',
              school_id: school ? school.value : '',  // Set school_id correctly
              schools_handled: response.tsc.schools_handled || [], // Autofill the schools_handled field
            });
          } else {
            console.warn('Form is not initialized yet.');
          }
        } else {
          console.warn('No TSC data found in the response.');
        }
      },
      (error) => {
        console.error('Error fetching TSC details:', error);
      }
    );
  }

  fetchSchools(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tscService.getSchoolDetails().subscribe(
        (response: any) => {
          this.schools = response.schools.map((school: any) => ({
            value: school.School_id,
            viewValue: school.school_name,
          }));
          resolve();
        },
        (error: any) => {
          console.error('Error fetching schools:', error);
          reject(error);
        }
      );
    });
  }

  // Function to show the popup message
  showPopup(message: string, type: 'success' | 'error'): void {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.backgroundColor = type === 'success' ? 'green' : 'red';
    popup.style.color = 'white';
    popup.style.fontSize = '20px';
    popup.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '1000';

    document.body.appendChild(popup);

    setTimeout(() => {
      document.body.removeChild(popup);
    }, 2000);
  }

  onSubmit() {
    if (this.tscForm.valid) {
      const tscData = this.tscForm.value;
  
      // Ensure current user ID is available
      if (!this.currentUserId) {
        console.error('User is not authenticated');
        this.showPopup('User is not authenticated.', 'error');
        return;
      }
  
      tscData.user_id = this.currentUserId; // Assign user_id
  
      if (this.tscId) {
        // Update existing TSC
        tscData.tsc_id = this.tscId;
        console.log('Updating TSC Data:', tscData);
  
        this.tscService.updateTsc(this.tscId, tscData).subscribe(
          (response) => {
            console.log('TSC updated successfully', response);
            this.showPopup('TSC updated successfully!', 'success');
            
            // Close the dialog before resetting the form
            this.dialogRef.close(response);
            
            // Reset the form after closing the dialog
            
          },
          (error) => {
            console.error('Error updating TSC', error);
            this.showPopup('Error updating TSC.', 'error');
          }
        );
      } else {
        // Create a new TSC
        console.log('Adding TSC Data:', tscData);
  
        this.tscService.addTsc(tscData, this.currentUserId).subscribe(
          (response) => {
            console.log('TSC added successfully', response);
            this.showPopup('TSC added successfully!', 'success');
            
            // Close the dialog before resetting the form
            this.dialogRef.close(response);
            
            // Reset the form after closing the dialog
         
          },
          (error) => {
            console.error('Error adding TSC', error);
            this.showPopup('Error adding TSC.', 'error');
          }
        );
      }
    }
  }

  
  onCancel() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    // Unsubscribe from the current user subscription when the component is destroyed
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

 
  blockNumbers(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Check if the input contains numbers
    if (/\d/.test(value)) {
      input.value = value.replace(/\d/g, ''); // Replace numbers with an empty string
    }
  }
  blockAlphabets(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // Check if the value contains any alphabet
    if (/[a-zA-Z]/.test(value)) {
      input.value = value.replace(/[a-zA-Z]/g, '');  // Remove any alphabetic characters
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
}