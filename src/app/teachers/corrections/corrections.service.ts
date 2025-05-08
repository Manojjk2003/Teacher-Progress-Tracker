import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CorrectionsService {
  private baseUrl = 'http://api.kiddypi.com:8002';

  constructor(private http: HttpClient) {}

  postTeacherProjectScore(teacherProjectId: string, userId: string, scoreData: any): Observable<any> {
    const url = `${this.baseUrl}/teacher-project/${teacherProjectId}/score/${userId}`;
    console.log('Posting score to URL:', url);
    return this.http.post(url, scoreData).pipe(
      catchError(this.handleError)
    );
  }

  postStudentProjectScore(studentProjectId: string, userId: string, scoreData: any): Observable<any> {
    const url = `${this.baseUrl}/student-project/${studentProjectId}/score/${userId}`;
    console.log('Posting score to URL:', url);
    return this.http.post(url, scoreData).pipe(
      catchError(this.handleError)
    );
  }

  patchTeacherProjectScore(teacherProjectId: string, userId: string, scoreData: any): Observable<any> {
    const url = `${this.baseUrl}/teacher-project/${teacherProjectId}/score/${userId}`;
    console.log('Patching score to URL:', url);
    return this.http.patch(url, scoreData, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  patchStudentProjectScore(studentProjectId: string, userId: string, scoreData: any): Observable<any> {
    const url = `${this.baseUrl}/student-project/${studentProjectId}/score/${userId}`;
    console.log('Patching score to URL:', url);
    return this.http.patch(url, scoreData, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error);
    return throwError('Something went wrong; please try again later.');
  }
}
