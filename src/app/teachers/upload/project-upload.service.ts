import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface TeacherProjectUpload {
  project_link: string;
  feedback: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectUploadService {
  private baseUrl = 'http://api.kiddypi.com:8002'; // Replace with your actual backend base URL

  constructor(private http: HttpClient) {}

  uploadTeacherProject(teacherId: string, projectBatch: TeacherProjectUpload[]): Observable<UploadResponse> {
    const url = `${this.baseUrl}/upload_teacher_projects/${teacherId}`;
    return this.http.post<UploadResponse>(url, projectBatch, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      catchError((error) => {
        console.error('Error uploading teacher projects:', error);
        return throwError(error);
      })
    );
  }

  uploadStudentProject(teacherId: string, data: any): Observable<any> {
    const endpoint = `${this.baseUrl}/upload_student_projects/${teacherId}`;
    return this.http.post(endpoint, data).pipe(
      catchError((error: any) => {
        console.error('Upload failed:', error);
        return throwError(error);
      })
    );
  }

  getUserDashboardData(userId: string): Observable<any> {
    const url = `${this.baseUrl}/dashboard/${userId}`;
    return this.http.get(url).pipe(
      catchError((error: any) => {
        console.error('Failed to fetch dashboard data:', error);
        return throwError(error);
      })
    );
  }
  getTeacherIdByUid(uid: string): Promise<string> {
    console.log('Fetching teacher data for UID:', uid);  // Debugging line
    return this.http.get<any>(`${this.baseUrl}/teacher/${uid}`).toPromise()
      .then(response => {
        console.log('Teacher data received:', response);  // Debugging line
        return response.teacher_id;  // Ensure this matches your actual response structure
      });
  }
  
  
}
