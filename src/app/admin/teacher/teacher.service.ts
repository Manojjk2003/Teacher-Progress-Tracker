import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = 'http://api.kiddypi.com:8001'; // Base URL for your backend

  constructor(private http: HttpClient) {}

  // Fetch all teachers from the backend
  getAllTeachers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/teachers`); // Endpoint for getting all teachers
  }
  updateTeacher(teacher_id: string, updatedData: any): Observable<any> {
    const queryParams = new URLSearchParams(updatedData).toString(); // Converts the object to query string
    return this.http.patch(`${this.apiUrl}/update-teacher/${teacher_id}?${queryParams}`, {});
  }
  
  deleteTeacher(teacherId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-teacher/${teacherId}`);
  }
  getSchools(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schools`); // Fetch schools from the correct endpoint
  }
}
