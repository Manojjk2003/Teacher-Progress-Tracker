import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddOrganizationService {

  private apiUrl = 'http://api.kiddypi.com:8001/organizations'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  addOrganization(users_id: string, organizationData: any): Observable<any> {
    // Create HttpParams for query parameters
    const params = new HttpParams()
      .set('organization_name', organizationData.organization_name)
      .set('contact_person', organizationData.contact_person)
      .set('email', organizationData.email)
      .set('ph_no', organizationData.ph_no)
      .set('address', organizationData.address);

    // Send POST request with users_id in the URL path and data in query params
    return this.http.post<any>(`${this.apiUrl}/${users_id}`, null, { params });
  }
}
