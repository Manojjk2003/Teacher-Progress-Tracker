import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminDashboardService } from './admin-dashboard.service';
import { AuthService } from '../../../services/auth.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedService } from '../shared.service';

interface Teacher {
  id: number;
  name: string;
  classes_managed: string;
  studentCount: number;
  cumulativeScore: number;
  weekScore: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatPaginatorModule, MatGridListModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  adminName = '';
  schoolCount = 0;
  teacherCount = 0;
  studentCount = 0;
  projectCount = 0;
  evaluatedProjects = 0;
  projectsToBeEvaluated = 0;

  displayedColumns: string[] = [
    'index',
    'name',
    'grade',
    'studentCount',
    'cumulativeScore',
    'weekScore',
  ];
  dataSource = new MatTableDataSource<Teacher>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: AdminDashboardService,
    private authService: AuthService,
    private sharedService: SharedService

  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.uid) {
        console.log('Current User UID:', user.uid);
        this.sharedService.setUserId(user.uid);
        this.loadDashboardData(user.uid);
      } else {
        console.warn('User is not authenticated');
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private loadDashboardData(userId: string): void {
    this.apiService.getDashboardData(userId).subscribe({
      next: (data) => {
        console.log('Dashboard Data:', data);
        this.adminName = data.admin_details?.admin_name || 'N/A';
        this.schoolCount = data.number_of_schools || 0;
        this.teacherCount = data.number_of_teachers || 0;
        this.studentCount = data.number_of_student_projects || 0;
        this.projectCount = data.number_of_teacher_projects || 0;
        this.evaluatedProjects = data.number_of_evaluated_projects || 0;
        this.projectsToBeEvaluated =
          data.number_of_projects_to_be_evaluated || 0;

        // Update the data source for the table
        this.dataSource.data = data.teacher_details.map((teacher: any) => ({
          id: teacher.teacher_id,
          name: teacher.teacher_name,
          classes_managed: teacher.classes_managed || '',
          studentCount: teacher.number_of_students,
          cumulativeScore: teacher.cumulative_score,
          weekScore: teacher.weekly_score,
        }));
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
      },
    });
  }
}