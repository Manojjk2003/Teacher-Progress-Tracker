import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = 'http://api.kiddypi.com:8002'; // Base URL for API requests
  // http://localhost:8003

  constructor(private http: HttpClient) {}

  // Get teacher projects// Combined method to get teacher and student projects based on user ID
  getDashboardData(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard/${userId}`);
  }
  // Delete teacher project
  deleteTeacherProject(projectId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete_teacher_project/${projectId}`);
  }

  // Delete student project
  deleteStudentProject(projectId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete_student_project/${projectId}`);
  }

  // Get teacher project scores
  getTeacherProjectScores(projectId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/teacher_project_scores/${projectId}`);
  }

  // Get student project scores
  getStudentProjectScores(projectId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/student_project_scores/${projectId}`);
  }
}
