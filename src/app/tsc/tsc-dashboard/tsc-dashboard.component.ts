import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from './tsc-dasboard.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Import AuthService
import { Router } from '@angular/router';
import { SharedService } from '../shared.service'; // Import SharedService

@Component({
  selector: 'app-tsc-dashboard',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './tsc-dashboard.component.html',
  styleUrls: ['./tsc-dashboard.component.css'],
})
export class TscDashboardComponent implements OnInit {
  displayedColumns: string[] = ['name', 'contactNo', 'email', 'lastUpdated'];
  dataSource = new MatTableDataSource();
  stats = {
    numberOfTeachers: 0,
    evaluatedProjects: 0,
    pendingProjects: 0,
    numberOfStudents: 0,
  };
  teacher_name: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private authService: AuthService, // Inject AuthService
    private router: Router,
    private sharedService: SharedService // Inject SharedService
  ) {}

  ngOnInit() {
    // Fetch user ID from the route or AuthService
    const userId = this.route.snapshot.paramMap.get('user_id');
    if (userId) {
      console.log('User ID from route:', userId);
      this.sharedService.setUserId(userId); // Set user ID in SharedService
      this.loadTscSummary(userId);
    } else {
      this.authService.getCurrentUser().subscribe(
        (user) => {
          if (user?.uid) {
            console.log('User ID from AuthService:', user.uid);
            this.sharedService.setUserId(user.uid); // Set user ID in SharedService
            this.loadTscSummary(user.uid);
          } else {
            
           
          }
        },
        (error) => {
          console.error('Error fetching user details:', error);
          
        }
      );
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

  // Method to fetch the TSC summary based on userId
  loadTscSummary(userId: string) {
    this.apiService.getTscSummary(userId).subscribe(
      (response) => {
        this.stats.numberOfTeachers = response.num_teachers;
        this.stats.evaluatedProjects = response.total_evaluated;
        this.stats.pendingProjects = response.total_pending;
        this.stats.numberOfStudents = response.total_students;
        this.dataSource.data = response.teachers;
  
        // Set the TSC name from the response
        this.teacher_name = response.tsc_name; // Updated to match the response
  
        // Initialize paginator and sort
        if (this.paginator) this.dataSource.paginator = this.paginator;
        if (this.sort) this.dataSource.sort = this.sort;
  
        const tscId = response.tsc_id;
        if (tscId) {
          sessionStorage.setItem('tscId', tscId);
          this.sharedService.setUserId(tscId);
        }
      },
      (error) => {
        console.error('Error fetching TSC summary:', error);
      }
    );
  }
  
  
}
