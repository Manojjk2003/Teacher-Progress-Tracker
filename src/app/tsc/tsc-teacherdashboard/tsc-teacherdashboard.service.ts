import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Define interfaces for the dashboard response
export interface ProjectLink {
  project_id: string;
  project_link: string;
  uploadTime: string;
}

export interface DashboardResponse {
  school_name: string;
  teacher_id: string;
  user_id: string;
  teacher_name: string;
  num_teacher_projects: number;
  num_student_projects: number;
  distinct_grades: number;
  total_students: number;
  teacher_project_links: ProjectLink[];
  student_project_links: ProjectLink[];
}

// Define an interface for the project scores response
export interface ProjectScoresResponse {
  teacher_name: any;
  school_name: any;
  organization_name: any;
  project_link: string;
  scores: {
    creativity: string;
    code_complexity: string;
    originality_of_code: string;
    usage_of_spr_bd: string;
    animations_sounds: string;
    total: string;
    feedback: string;
  };
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class TscTeacherdashboardService {
  private baseUrl: string = 'http://api.kiddypi.com:8000'; // Adjust according to your backend URL

  constructor(private http: HttpClient) {}

  // Method to fetch the teacher dashboard data
  getTeacherDashboard(teacherId: string): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}/dashboard/${teacherId}`).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  // Method to fetch teacher project scores
  getTeacherProjectScores(projectId: string): Observable<ProjectScoresResponse> {
    return this.http.get<ProjectScoresResponse>(`${this.baseUrl}/teacher_project_scores/${projectId}`).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  // Method to fetch student project scores
  getStudentProjectScores(projectId: string): Observable<ProjectScoresResponse> {
    return this.http.get<ProjectScoresResponse>(`${this.baseUrl}/student_project_scores/${projectId}`).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    // Customize error handling as needed
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage); // Log the error to the console
    return throwError(errorMessage); // Return an observable with a user-facing error message
  }
}
