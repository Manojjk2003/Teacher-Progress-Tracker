import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class TscService {
  private baseUrl = 'http://api.kiddypi.com:8001';  // API base URL

  constructor(private http: HttpClient) {}

  // Method to get all schools
  getSchoolDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/schools`);
  }

  // Method to get all TSCs
  getTscs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/tscs`); // Endpoint to fetch all TSCs
  }

// Get TSC details by ID
getTscDetails(tsc_id: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/tsc/${tsc_id}`);
}


updateTsc(tscId: string, tscData: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  // Prepare the query parameters for the update
  const params = new HttpParams()
    .set('name', tscData.name)
    .set('email', tscData.emailId)
    .set('phone_number', tscData.phone_number)
    .set('school_id', tscData.school_id)
    .set('gender', tscData.gender)
    .set('schools_handled', JSON.stringify(tscData.schools_handled));  // Add schools_handled here, assuming it's an array

  // Use the endpoint with tscId and the query params for update
  return this.http.patch<any>(
    `${this.baseUrl}/update-tsc/${tscId}`, // URL with tscId as part of the path
    null, // No body data is passed here; only query parameters
    { headers, params } // Send params in the request
  );
}



  // Add new TSC with query parameters
  addTsc(tscData: any, users_id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Prepare the query parameters
    const params = new HttpParams()
      .set('name', tscData.name)
      .set('email', tscData.emailId)
      .set('phone_number', tscData.phone_number)
      .set('school_id', tscData.school_id)
      .set('gender', tscData.gender);

    // Use the endpoint with users_id and the query params
    return this.http.post<any>(
      `${this.baseUrl}/add-tsc/${users_id}`, // URL with users_id as part of the path
      null, // No body data is passed here; only query parameters
      { headers, params } // Send params in the request
    );
  }

  // Delete TSC by tsc_id
  deleteTscByTscId(tsc_id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-tsc-by-user/${tsc_id}`);
  }
}
