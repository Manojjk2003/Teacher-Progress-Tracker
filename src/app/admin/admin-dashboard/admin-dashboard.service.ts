import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
    private apiUrl = 'http://api.kiddypi.com:8001'; // API URL

 

  constructor(private http: HttpClient) {}

  getDashboardData(userId: string): Observable<any> {
    // Make sure this is the correct endpoint
    return this.http.get(`${this.apiUrl}/admin_dashboard/${userId}`);
  }
}
