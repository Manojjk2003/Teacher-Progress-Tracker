import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvalutionService {

  private apiUrl = 'http://api.kiddypi.com:8001'; // API URL

  constructor(private http: HttpClient) {}

  // Method to get schools by organization ID
  getSchoolsByOrganization(organizationId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schools/${organizationId}`);
  }
}
