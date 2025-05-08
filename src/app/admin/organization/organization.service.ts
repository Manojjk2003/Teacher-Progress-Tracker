import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private apiUrl = 'http://api.kiddypi.com:8001'; // Ensure this is the correct API URL

  constructor(private http: HttpClient) {}

  // Get all organizations
  getOrganizations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/organizations`).pipe(
      catchError(this.handleError)
    );
  }

  // Update organization
  updateOrganization(users_id: string, organization_id: string, organization: any): Observable<any> {
    // Build the base URL
    const url = `${this.apiUrl}/organizations/${users_id}/${organization_id}`;
  
    // Construct query parameters from the organization object
    const queryParams = new URLSearchParams({
      organization_name: organization.organization_name,
      contact_person: organization.contact_person,
      email: organization.email,
      ph_no: organization.ph_no,
      address: organization.address,
    }).toString();
  
    // Append the query parameters to the URL
    const fullUrl = `${url}?${queryParams}`;
  
    console.log('Constructed URL:', fullUrl); // Debug: Log the full URL
  
    // Send the PATCH request with the query parameters
    return this.http.patch<any>(fullUrl, {}, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }
  
 
  // Delete organization
  deleteOrganization(organizationId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/organizations/${organizationId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get HTTP options, including headers
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', // Ensure content type is set to JSON
      }),
    };
  }

  // Handle errors in HTTP requests
  private handleError(error: HttpErrorResponse) {
    // Log the error details
    console.error('Error occurred:', error);
   
    let errorMessage = 'Something went wrong; please try again later.';

    // Provide more specific error messages depending on error type
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Backend error: ${error.status} - ${error.message}`;
    }
   
    // Return an observable with an error message
    return throwError(errorMessage);
  }
}