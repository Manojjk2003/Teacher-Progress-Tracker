import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddSchoolService {
  private apiUrl = 'http://api.kiddypi.com:8001'; // Replace with your actual FastAPI URL
  private orgUrl = 'http://api.kiddypi.com:8001/organizations'; // Replace with your organizations endpoint

  constructor(private http: HttpClient) {}

  // Get organizations
  getOrganizations(): Observable<any> {
    return this.http.get<any>(this.orgUrl).pipe(
      tap((response) => {
        console.log('API Response:', response); // Log the API response to check
      })
    );
  }

  // Add school
  addSchool(users_id: string, schoolDetails: any): Observable<any> {
    const url = `${this.apiUrl}/add-school/${users_id}`;
    const params = {
      school_name: schoolDetails.school_name,
      email: schoolDetails.email,
      ph_no: schoolDetails.ph_no,
      addr: schoolDetails.addr,
      organization_id: schoolDetails.organization_id,
    };

    return this.http.post(url, null, { params });
  }
}
