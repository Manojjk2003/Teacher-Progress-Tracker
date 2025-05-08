import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private baseUrl = 'http://api.kiddypi.com:8001'; // Update with your actual backend URL

  constructor(private http: HttpClient) {}

  getSchools(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/schools`);
  }

  getSelectedOrganization(): Observable<any> {
    // Assuming your API endpoint for fetching organizations is /organizations
    return this.http.get<any>(`${this.baseUrl}/organizations`);
  }

  addSchool(school: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-school`, school);
  }
  updateSchool(schoolId: string, changes: HttpParams): Observable<any> {
    // Send PATCH request with the schoolId in the URL path and changes in query parameters
    return this.http.patch(`${this.baseUrl}/update-school/${schoolId}`, null, { params: changes });
  }
  
  
  
  

  deleteSchool(school_id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete-school/${school_id}`);
  }
}