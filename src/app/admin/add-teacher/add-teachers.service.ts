import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddTeachersService {
  // Replace with your actual backend URL
  private apiUrl = 'http://api.kiddypi.com:8001'; // Base URL for the backend

  constructor(private http: HttpClient) {}

  addTeacher(usersId: string, params: HttpParams): Observable<any> {
    // Make the POST request with the query params
    return this.http.post(`${this.apiUrl}/add-teacher/${usersId}`, null, { params });
  }
  getSchools(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schools`); // Fetch schools from the correct endpoint
  }

getSchoolsByOrganization(organizationId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/schools/${organizationId}`);
}


getOrganizations(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/organizations`);
}


}
