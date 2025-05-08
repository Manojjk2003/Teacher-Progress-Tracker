import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TscTeacherdashboardService, DashboardResponse } from './tsc-teacherdashboard.service';
import { SharedService } from '../shared.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tsc-teacherdashboard',
  templateUrl: './tsc-teacherdashboard.component.html',
  styleUrls: ['./tsc-teacherdashboard.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule
  ],
})
export class TscTeacherdashboardComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['sno', 'link', 'action', 'status'];
  teacherProjectsDataSource = new MatTableDataSource<any>([]);
  studentProjectsDataSource = new MatTableDataSource<any>([]);

  totalStudents: number = 0;
  numTeacherProjects: number = 0;
  numStudentProjects: number = 0;
  distinctGrades: number = 0;
  teacherName: string = '';  // Store teacher name
  schoolName: string = '';   // Store school name
  organizationName: string | null = null;
  @ViewChild('teacherPaginator') teacherPaginator!: MatPaginator;
  @ViewChild('studentPaginator') studentPaginator!: MatPaginator;

  constructor(
    private router: Router,
    private teacherDashboardService: TscTeacherdashboardService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const teacherId = this.sharedService.getTeacherId();
    const orgData = this.sharedService.getSelectedOrganization();
    this.organizationName = orgData?.name || 'Unknown Organization';
    if (teacherId) {
      this.fetchTeacherDashboard(teacherId);
    } else {
      console.error('No teacher ID found.');
    }
  }

  ngAfterViewInit() {
    this.teacherProjectsDataSource.paginator = this.teacherPaginator;
    this.studentProjectsDataSource.paginator = this.studentPaginator;
  }

  fetchTeacherDashboard(teacherId: string): void {
    this.teacherDashboardService.getTeacherDashboard(teacherId).subscribe({
      next: (response: DashboardResponse) => {
        // Correctly use uploadTime
        this.teacherProjectsDataSource.data = response.teacher_project_links.map(project => ({
          ...project,
          uploadTime: project.uploadTime // Use uploadTime here
        }));
  
        this.studentProjectsDataSource.data = response.student_project_links.map(project => ({
          ...project,
          uploadTime: project.uploadTime // Use uploadTime here
        }));
  
        this.totalStudents = response.total_students;
        this.numTeacherProjects = response.num_teacher_projects;
        this.numStudentProjects = response.num_student_projects;
        this.distinctGrades = response.distinct_grades;
        this.teacherName = response.teacher_name || 'Unknown Teacher';
        this.schoolName = response.school_name || 'Unknown School';
      },
      error: (err) => {
        console.error('Error fetching teacher dashboard:', err);
      }
    });
  }
  
  

  viewProject(link: string, projectId: string, projectType: 'teacher' | 'student') {
    let projectScores$;

    if (projectType === 'teacher') {
        projectScores$ = this.teacherDashboardService.getTeacherProjectScores(projectId);
    } else {
        projectScores$ = this.teacherDashboardService.getStudentProjectScores(projectId);
    }

    projectScores$.subscribe({
      next: (response) => {
          console.log('Project scores fetched:', response);
    
          const scores = response.scores || {}; // Default to an empty object if scores are not available
          const feedback = scores.feedback || ''; // Default to an empty string if feedback is not available
    
          this.router.navigate(['tsc-navbar/correction'], {
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
          this.router.navigate(['tsc-navbar/correction'], {
              queryParams: {
                  link: link,
                  type: projectType,
                  scores: JSON.stringify({}), // Default to an empty object
                  feedback: '', // Default to an empty string
                  projectId: projectId,
                  organizationName: this.organizationName,  // ✅ Pass Organization Name
                  schoolName: this.schoolName,             // ✅ Pass School Name
                  teacherName: this.teacherName 
                  
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


  