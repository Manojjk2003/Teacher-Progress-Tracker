import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AdminTeacherdashboardService } from './admin-teacherdashboard.service';
import { SharedService } from '../shared.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-admin-teacherdashboard',
  templateUrl: './admin-teacherdashboard.component.html',
  styleUrls: ['./admin-teacherdashboard.component.css'],
  imports: [CommonModule, MatCardModule, MatFormFieldModule,MatButtonModule, MatTableModule, MatPaginatorModule,MatIconModule,MatTooltipModule, RouterLink],
})
export class AdminTeacherdashboardComponent implements OnInit {
  distinctGrades: string[] = [];
  totalStudents: number = 0;
  numTeacherProjects: number = 0;
  numStudentProjects: number = 0;
   teacherName: string = '';  // Store teacher name
  schoolName: string = '';   // Store school name
  organizationName: string | null = null;

  teacherProjectsDataSource = new MatTableDataSource<any>();
  studentProjectsDataSource = new MatTableDataSource<any>();

  @ViewChild('teacherPaginator') teacherPaginator!: MatPaginator;
  @ViewChild('studentPaginator') studentPaginator!: MatPaginator;

  constructor(
    private adminTeacherdashboardService: AdminTeacherdashboardService,
    private sharedService: SharedService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const teacherId = this.sharedService.getTeacherId();
    const orgData = this.sharedService.getSelectedOrganization();
    this.organizationName = orgData?.name || 'Unknown Organization';

    if (teacherId) {
      this.adminTeacherdashboardService.getDashboard(teacherId).subscribe(
        (data) => {
          this.distinctGrades = data.distinct_grades;
          this.totalStudents = data.total_students;
          this.numTeacherProjects = data.num_teacher_projects;
          this.numStudentProjects = data.num_student_projects;
          this.teacherName = data.teacher_name || 'Unknown Teacher';
          this.schoolName = data.school_name || 'Unknown School';

          
          this.teacherProjectsDataSource.data = data.teacher_project_links;
          this.studentProjectsDataSource.data = data.student_project_links;
        },
        (error) => {
          console.error('Error fetching dashboard data:', error);
        }
      );
    }
  }

  ngAfterViewInit(): void {
    this.teacherProjectsDataSource.paginator = this.teacherPaginator;
    this.studentProjectsDataSource.paginator = this.studentPaginator;
  }

  viewProject(link: string, projectId: string, projectType: 'teacher' | 'student') {
    let projectScores$;

    if (projectType === 'teacher') {
        projectScores$ = this.adminTeacherdashboardService.getTeacherProjectScores(projectId);
    } else {
        projectScores$ = this.adminTeacherdashboardService.getStudentProjectScores(projectId);
    }

    projectScores$.subscribe({
      next: (response) => {
          console.log('Project scores fetched:', response);
    
          const scores = response.scores || {}; // Default to an empty object if scores are not available
          const feedback = scores.feedback || ''; // Default to an empty string if feedback is not available
    
          this.router.navigate(['admin-navbar/admin-correction'], {
              queryParams: {
                  link: link,
                  type: projectType,
                  scores: JSON.stringify(scores),
                  feedback: feedback,
                  projectId: projectId,
                  status: response.status,
                  organizationName: response.organization_name, // Added
                  schoolName: response.school_name, // Added
                  teacherName: response.teacher_name // Added
                  
              }
          });
      },
      error: (err) => {
          console.warn('Could not fetch project scores. Proceeding with default values.', err);
    
          // Navigate to the page with default values
          this.router.navigate(['admin-navbar/admin-correction'], {
              queryParams: {
                  link: link,
                  type: projectType,
                  scores: JSON.stringify({}), // Default to an empty object
                  feedback: '', // Default to an empty string
                  projectId: projectId,
                  organizationName: this.organizationName,  // ✅ Pass Organization Name
    schoolName: this.schoolName,             // ✅ Pass School Name
    teacherName: this.teacherName            // ✅ Pass Teacher Name
                  
                  
              }
          });
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
    
}
