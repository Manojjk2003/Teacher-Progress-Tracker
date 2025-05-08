import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private userId: string | null = null;
  private schoolId: string | null = null;
  private teacherId: string | null = null;
  private selectedOrganizationId: string | null = null; 
  private selectedOrganizationName: string | null = null;
  private schoolList: any[] = [];

  // Store User ID
  setUserId(id: string): void {
    this.userId = id;
    localStorage.setItem('userId', id); // Store in local storage
    console.log('User ID set in SharedService & Local Storage:', id);
  }

  getUserId(): string | null {
    if (!this.userId) {
      this.userId = localStorage.getItem('userId'); // Retrieve from local storage
    }
    console.log('Retrieved User ID from SharedService:', this.userId);
    return this.userId;
  }

  clearUserId(): void {
    this.userId = null;
    localStorage.removeItem('userId'); // Clear from local storage
    console.log('User ID cleared from SharedService & Local Storage');
  }


  setSchoolId(id: string): void {
    console.log('Setting School ID:', id);
    this.schoolId = id;
  }
  
  getSchoolId(): string | null {
    console.log('Getting School ID:', this.schoolId);
    return this.schoolId;
  }

  setTeacherId(id: string): void {
    this.teacherId = id;
  }

  getTeacherId(): string | null {
    return this.teacherId;
  }

  setSchoolList(schools: any[]): void {
    this.schoolList = schools;
  }

  getSchoolList(): any[] {
    return this.schoolList;
  }

  setSelectedOrganization(id: string, name: string): void {
    this.selectedOrganizationId = id;
    this.selectedOrganizationName = name;
  }

  getSelectedOrganization(): { id: string | null; name: string | null } {
    return { id: this.selectedOrganizationId, name: this.selectedOrganizationName };
  }
}
