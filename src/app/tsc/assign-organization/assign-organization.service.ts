import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssignOrganizationService {
  private baseUrl = 'http://api.kiddypi.com:8000'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  // Method to fetch the organization by TSC ID
  getOrganizationByTsc(tscId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/organization-by-tsc/${tscId}`);
  }
}
