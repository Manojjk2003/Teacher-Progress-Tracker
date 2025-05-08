import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ensure this is provided in root
})
export class ApiService {
  private baseUrl = 'http://api.kiddypi.com:8000'; // Change to your actual API URL.

  constructor(private http: HttpClient) {}

  getTscSummary(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tsc-summary/${userId}`);
  }
}
