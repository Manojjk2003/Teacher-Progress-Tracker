import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ensures the service is a singleton
})
export class AssignTeacherService {
  private apiUrl = 'http://api.kiddypi.com:8000/school-teachers-tsc'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getTeachersBySchool(schoolId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${schoolId}`);
  }
}
