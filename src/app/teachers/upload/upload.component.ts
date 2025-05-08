import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UploadStudentComponent } from '../upload-student/upload-student.component';
import { UploadTeacherComponent } from '../upload-teacher/upload-teacher.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    RouterModule,
    UploadStudentComponent,
    UploadTeacherComponent
  ]
})
export class UploadComponent {
  showTeacherForm: boolean = true;
  showStudentForm: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onTabChange(event: MatTabChangeEvent) {
    this.showTeacherForm = event.index === 0;
    this.showStudentForm = event.index === 1;
  }
}
