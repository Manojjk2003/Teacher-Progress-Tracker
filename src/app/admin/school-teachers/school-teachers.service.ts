import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolTeachersService {

  private apiUrl = 'http://api.kiddypi.com:8001'; // API URL
 
   constructor(private http: HttpClient) {}
   getTeachersBySchool(schoolId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/teachers/${schoolId}`); // Adjust the endpoint as necessary
  }
}
