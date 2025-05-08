import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllOrganizationService {

  private apiUrl = 'http://api.kiddypi.com:8001';  // Update this with the correct URL of your backend

  constructor(private http: HttpClient) { }

  // Fetch all organizations from backend
  getOrganizations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/organizations`).pipe(
      catchError(this.handleError)  // Using the handleError method to handle any errors
    );
  }

  // Define the handleError method to process errors
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    // Check if it's a known error (like HTTP error)
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    // Optionally log the error or show it to the user
    console.error(errorMessage);

    // Return an observable with an error message
    return throwError(() => new Error(errorMessage));
  }
}
