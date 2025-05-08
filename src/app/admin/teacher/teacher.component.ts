import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TeacherService } from './teacher.service';
import { AddTeacherComponent } from '../add-teacher/add-teacher.component';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent implements OnInit {
  teachers: any[] = [];
  filteredTeachers: any[] = [];
  searchQuery: string = '';
  selectedTeacher: any = null;
  editTeacherForm!: FormGroup; // FormGroup for editing teacher
  @ViewChild('editTeacherDialog') editTeacherDialog!: TemplateRef<any>; // Reference to the edit dialog template
  @ViewChild('deleteConfirmDialog') deleteConfirmDialog!: TemplateRef<any>;

  dialogRef: any;

  constructor(
    private teacherService: TeacherService,
    private dialog: MatDialog,
    private fb: FormBuilder // FormBuilder for reactive forms
  ) {}
  schools: { id: string; school_name: string }[] = [];
  ngOnInit(): void {
    this.loadTeachers();
    this.initEditTeacherForm(); // Initialize the form
    this.fetchSchools();
  
  }

  fetchSchools() {
    this.teacherService.getSchools().subscribe(
      (response) => {
        if (response && response.schools) {
          this.schools = response.schools.map((school: any) => ({
            id: school.School_id,
            school_name: school.school_name
          }));
        } else {
          console.error('Unexpected response format:', response);
          // alert('Failed to fetch schools. Unexpected response format.');
        }
      },
      (error) => {
        console.error('Error fetching schools:', error);
        // alert('Failed to fetch schools. Please try again.');
      }
    );
  }

  // Initialize the Edit Teacher form
  private initEditTeacherForm(): void {
    this.editTeacherForm = this.fb.group({
      teacherId: [''], // Ensure this matches the teacher_id field from the backend
      name: [''],
      email: [''],
      contactNo: [''],
      numberOfStudents: [''],
      grades: [''],
      schoolName: [''],
    });
  }

  // Fetch teachers from the backend
  loadTeachers(): void {
    this.teacherService.getAllTeachers().subscribe({
      next: (response) => {
        this.teachers = response.teachers
          .map((teacher: any) => ({
            teacherId: teacher.teacher_id, 
            name: teacher.teacher_name,
            email: teacher.email,
            contactNo: teacher.contact_no,
            numberOfStudents: teacher.no_of_students,
            grades: teacher.classes,
            schoolName: teacher.school_name,
            createdAt: teacher.created_at || teacher.joined_at || 'N/A',
          }))
          .sort((a: { createdAt: string }, b: { createdAt: string }) => {
            const dateA = a.createdAt !== 'N/A' ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt !== 'N/A' ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // Oldest first
          });
  
        this.filteredTeachers = [...this.teachers];
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      },
    });
  }
  
  

  // Search Teachers by query
  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredTeachers = this.teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query) ||
        teacher.contactNo.toLowerCase().includes(query) ||
        teacher.schoolName.toLowerCase().includes(query)
    );
  }

   preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
  

  // Open Add Teacher dialog
  openAddTeacherDialog(): void {
    const dialogRef = this.dialog.open(AddTeacherComponent, {
      width: '550px', height: '650px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teachers.push(result); // Add the new teacher to the list
        this.filteredTeachers = [...this.teachers];
        this.loadTeachers();
      }
    });
  }

  // Open Edit Teacher dialog
  // Open Edit Teacher dialog
openEditTeacherDialog(teacher: any): void {
  // Find the school matching the teacher's schoolName
  const selectedSchool = this.schools.find((school) => school.school_name === teacher.schoolName);

  // Populate the form with the selected teacher's data
  this.editTeacherForm.setValue({
    teacherId: teacher.teacherId,
    name: teacher.name,
    email: teacher.email,
    contactNo: teacher.contactNo,
    numberOfStudents: teacher.numberOfStudents,
    grades: teacher.grades,
    schoolName: selectedSchool ? selectedSchool.id : '', // Pre-select the school ID
  });

  // Open the dialog
  this.dialog.open(this.editTeacherDialog, {
    width: '400px',
  });
}

// Save changes made to the teacher
saveChanges(): void {
  if (this.editTeacherForm.invalid) {
    alert('Please fill all required fields.');
    return;
  }

  // Get the updated form values directly
  const updatedTeacher = this.editTeacherForm.value;

  // Find the selected school details (if any)
  const selectedSchool = this.schools.find((s) => s.id === updatedTeacher.schoolName);
  if (selectedSchool) {
    updatedTeacher.schoolId = selectedSchool.id; // Use the school ID for the backend
  }

  console.log('Data sent to backend:', updatedTeacher);

  // Prepare the query parameters
  const params = {
    teacher_id: updatedTeacher.teacherId,
    name: updatedTeacher.name,
    email: updatedTeacher.email,
    
    phone_number: updatedTeacher.contactNo,
    school_id: updatedTeacher.schoolId,
    number_of_students: updatedTeacher.numberOfStudents,
    classes: updatedTeacher.grades,
    // date_of_birth: updatedTeacher.dateOfBirth,  // Assuming dateOfBirth is part of the form
    // gender: updatedTeacher.gender,              // Assuming gender is part of the form
    // age: updatedTeacher.age                     // Assuming age is part of the form
  };

  // Call the backend update API with query parameters
  this.teacherService.updateTeacher(updatedTeacher.teacherId, params).subscribe({
    next: (response) => {
      console.log('Update response from backend:', response);

      if (response && response.message === 'Teacher details updated successfully') {
        // alert(response.message);
        this.showPopup('Updated successfully!', 'success');

        // Update the local teacher list immutably
        this.teachers = this.teachers.map((teacher) =>
          teacher.teacherId === updatedTeacher.teacherId
            ? {
                ...teacher, // Retain existing fields
                ...updatedTeacher, // Overwrite with updated fields
                schoolName: selectedSchool ? selectedSchool.school_name : updatedTeacher.schoolName, // Update display name
              }
            : teacher
        );

        // Update the filtered teachers immutably
        this.filteredTeachers = [...this.teachers];

        // Close the dialog
        this.dialog.closeAll();
      } else {
        console.error('Unexpected response format:', response);
        alert('Failed to update teacher details. Please try again.');
      }
    },
    error: (err) => {
      console.error('Error updating teacher:', err);
      alert('Failed to update teacher details. Please try again.');
    },
  });
}



  closeDialog(): void {
    this.dialog.closeAll();
  }
  onDeleteTeacher(teacher: any): void {
    this.selectedTeacher = teacher; // Set the selected teacher
    const dialogRef = this.dialog.open(this.deleteConfirmDialog, { width: '400px' });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.deleteTeacher(teacher.teacherId); // Call deleteTeacher after confirmation
      }
    });
  }
  capitalizeFirstLetter(str: string): string {
    return str
      ? str
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : '';
  }

  // Perform deletion of the teacher
 // Perform deletion of the teacher
deleteTeacher(teacherId: string): void {
  this.teacherService.deleteTeacher(teacherId).subscribe({
    next: (response) => {
      console.log(response.message);

      // Remove the teacher from the list after successful deletion
      this.teachers = this.teachers.filter(teacher => teacher.teacherId !== teacherId);
      this.filteredTeachers = [...this.teachers];

      // Show success message
      this.showPopup('Deleted successfully!', 'success');

      // Close all dialogs after successful deletion
      this.dialog.closeAll();
    },
    error: (err) => {
      console.error('Error deleting teacher:', err);
      this.showPopup('Failed to delete teacher. Please try again.', 'error');
    }
  });
}

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
    }, 3000);
  }
  
  }
  
