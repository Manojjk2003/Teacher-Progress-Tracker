import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssignSchoolService {
  private baseUrl = 'http://api.kiddypi.com:8000'; // Replace with your actual backend URL
 

  constructor(private http: HttpClient) {}

  getAssignedSchools(organization_id: string): Observable<any> {
    // Pass tscId to the backend
    return this.http.get<any>(`${this.baseUrl}/tsc-schools/${organization_id}`);
  }
}
