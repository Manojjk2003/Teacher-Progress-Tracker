import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardService } from '../teacher-dashboard/teacher-dashboard.service';
import { AuthService } from '../../../services/auth.service';
import { SharedService } from '../shared.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../dialog_delete/delete-confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class TeacherDashboardComponent implements AfterViewInit {
  teacher = {
    teacher_id: '',
    teacher_name: '',
    num_teacher_projects: 0,
    num_student_projects: 0,
    distinct_grades: 0,
    total_students: 0,
    teacher_project_links: [],
    student_project_links: [],
    status: '',
  };
  teacherName: string = '';  // Store teacher name
  schoolName: string = '';   // Store school name
  organizationName: string | null = null;
  

  
  teacherProjectsDataSource = new MatTableDataSource<any>([]);
  studentProjectsDataSource = new MatTableDataSource<any>([]);
  pageSize = 5; // Default page size
  pageSizeOptions = [5, 10, 15];

  @ViewChild('teacherPaginator') teacherPaginator!: MatPaginator;
  @ViewChild('studentPaginator') studentPaginator!: MatPaginator;

  displayedColumns = ['sno', 'project_link', 'status', 'uploaded_time', 'action'];
  userId: string | null = null;
  currentSortOrder: { [key: string]: 'asc' | 'desc' } = { uploaded_time_teacher: 'desc', uploaded_time_student: 'desc' };


  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private authService: AuthService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    this.teacherProjectsDataSource.paginator = this.teacherPaginator;
    this.studentProjectsDataSource.paginator = this.studentPaginator;
    this.teacherProjectsDataSource.data = this.sortByUploadedTime(this.teacherProjectsDataSource.data, 'desc');
  this.studentProjectsDataSource.data = this.sortByUploadedTime(this.studentProjectsDataSource.data, 'desc');

    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.uid) {
        this.userId = user.uid;
        if (this.userId) {
          this.loadDashboardData(this.userId);
        }
      }
    });
  }

  loadDashboardData(userId: string) {
    this.dashboardService.getDashboardData(userId).subscribe((data: any) => {
      console.log('Dashboard Data:', data);
      this.teacher = data;
  
      // Update the teacher ID in the shared service
      this.sharedService.setTeacherId(data.teacher_id);
  
      // Set the teacher ID in session storage
      sessionStorage.setItem('teacherId', data.teacher_id);
  
      // Define the type for project data
      interface ProjectData {
        sno: number;
        project_link: string;
        status: string;
        uploaded_time: string;
        project_id: string;
      }
  
      // Format and sort the uploaded_time for teacher's projects in DESC order
      this.teacherProjectsDataSource.data = (data.teacher_project_links || [])
        .map((project: any, index: number): ProjectData => ({
          sno: index + 1,
          project_link: project.project_link,
          status: project.status,
          uploaded_time: project.uploaded_time
            ? new Date(project.uploaded_time).toLocaleString('en-IN', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
              })
            : 'N/A',
          project_id: project.project_id,
        }))
        .sort((a: ProjectData, b: ProjectData) => {
          const dateA = a.uploaded_time !== 'N/A' ? new Date(a.uploaded_time).getTime() : 0;
          const dateB = b.uploaded_time !== 'N/A' ? new Date(b.uploaded_time).getTime() : 0;
          return dateB - dateA; // Sort DESC (newest first)
        });
  
      // Format and sort the uploaded_time for student projects in DESC order
      this.studentProjectsDataSource.data = (data.student_project_links || [])
        .map((project: any, index: number): ProjectData => ({
          sno: index + 1,
          project_link: project.project_link,
          status: project.status,
          uploaded_time: project.uploaded_time
            ? new Date(project.uploaded_time).toLocaleString('en-IN', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
              })
            : 'N/A',
          project_id: project.project_id,
        }))
        .sort((a: ProjectData, b: ProjectData) => {
          const dateA = a.uploaded_time !== 'N/A' ? new Date(a.uploaded_time).getTime() : 0;
          const dateB = b.uploaded_time !== 'N/A' ? new Date(b.uploaded_time).getTime() : 0;
          return dateB - dateA; // Sort DESC (newest first)
        });
    });
  }
  

  onPageChange(event: PageEvent) {
    console.log('Page Event:', event);
    this.pageSize = event.pageSize; // Update the page size
  }

  openFilter(column: string, tableType: 'teacher' | 'student') {
    const sortKey = `uploaded_time_${tableType}`;
    const isAscending = this.currentSortOrder[sortKey] === 'asc';
    const newOrder = isAscending ? 'desc' : 'asc';
    this.currentSortOrder[sortKey] = newOrder;
  
    if (tableType === 'teacher') {
      this.teacherProjectsDataSource.data = this.sortByUploadedTime(this.teacherProjectsDataSource.data, newOrder);
    } else if (tableType === 'student') {
      this.studentProjectsDataSource.data = this.sortByUploadedTime(this.studentProjectsDataSource.data, newOrder);
    }
  }
  
  sortByUploadedTime(data: any[], order: 'asc' | 'desc'): any[] {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.uploaded_time).getTime();
      const dateB = new Date(b.uploaded_time).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }
  

  openDeleteConfirmationDialog(project: any, type: string): void {
    console.log('Open Delete Dialog for:', type, project);

    if (project.status !== 'pending') {
      this.showPopup('Only pending projects can be deleted.', 'error');
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { project, type },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProject(project, type);
      }
    });
  }

  deleteProject(project: any, type: string) {
    const deleteAction =
      type === 'teacher'
        ? this.dashboardService.deleteTeacherProject(project.project_id)
        : this.dashboardService.deleteStudentProject(project.project_id);

    deleteAction.subscribe(
      () => {
        this.loadDashboardData(this.userId!);
        this.showPopup(`${type} project deleted successfully.`, 'success');
      },
      (error) => {
        console.error('Error deleting project:', error);
        this.showPopup('Failed to delete project. Please try again.', 'error');
      }
    );
  }

  viewProject(link: string, projectId: string, projectType: 'teacher' | 'student') {
    let projectScores$;

    if (projectType === 'teacher') {
      projectScores$ = this.dashboardService.getTeacherProjectScores(projectId);
    } else {
      projectScores$ = this.dashboardService.getStudentProjectScores(projectId);
    }

    projectScores$.subscribe({
      next: (response) => {
        console.log('Project scores fetched:', response);

        this.router.navigate(['teacher-navbar/corrections'], {
          queryParams: {
            link: link,
            type: projectType,
            scores: JSON.stringify(response.scores || {}),
            feedback: response.scores?.feedback || '',
            projectId: projectId,
            status: response.status,
                  organizationName: response.organization_name, // Added
                  schoolName: response.school_name, // Added
                  teacherName: response.teacher_name // Added
          },
        });
      },
      error: (err) => {
        console.error('Error fetching project scores:', err);
        this.router.navigate(['teacher-navbar/corrections'], {
          queryParams: {
            link: link,
            type: projectType,
            scores: JSON.stringify({}),
            feedback: '',
            projectId: projectId,
            organizationName: this.organizationName,  // ✅ Pass Organization Name
            schoolName: this.schoolName,             // ✅ Pass School Name
            teacherName: this.teacherName 
          },
        });
      },
    });
  }

  // Custom Popup Method
  showPopup(message: string, type: 'success' | 'error') {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px'; // Position at the top
    popup.style.left = '50%'; // Center horizontally
    popup.style.transform = 'translateX(-50%)'; // Adjust for perfect centering
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.backgroundColor = type === 'success' ? 'green' : 'white';
    
    // Set text color based on background color
    popup.style.color = type === 'success' ? 'white' : 'black';
    
    popup.style.fontSize = '14px';
    popup.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '1000';


    popup.style.backgroundColor = type === 'success' ? 'green' : 'red'; 
popup.style.color = 'white'; 
popup.style.width = '320px'; // Adjust this value as needed
popup.style.maxWidth = '90%';
popup.style.fontSize = '17px';
popup.style.padding = '10px 20px';
popup.style.borderRadius = '5px';
popup.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
popup.style.zIndex = '1000';
popup.style.position = 'fixed';
popup.style.top = '20px';
popup.style.right = '20px';
popup.style.textAlign = 'center';

  
    document.body.appendChild(popup);
  
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 1000);
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