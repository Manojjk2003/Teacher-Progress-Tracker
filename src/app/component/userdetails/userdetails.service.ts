import { Injectable } from '@angular/core';
// import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserdetailsService {


  private apiBaseUrl = 'http://api.kiddypi.com:8003'; // Replace with your FastAPI base URL

  constructor(private http: HttpClient) {}

  // Fetch user profile by ID
  getUserProfile(users_id: string): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/profileget/${users_id}`);
  }

  // Update user profile
  updateUserProfile(userId: string, profileData: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/profileput/${userId}`, profileData);
  }

}
