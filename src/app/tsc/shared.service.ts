import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private schoolId: string | null = null;
  private teacherId: string | null = null; // Added for teacher ID
  private tsc_id: string | null = null;    // Store userId as tsc-id
  private userId: string | null = null;;
  private selectedOrganizationId: string | null = null; 
  private selectedOrganizationName: string | null = null;

  // Setters and getters for schoolId
  setSchoolId(id: string): void {
    this.schoolId = id;
  }

  getSchoolId(): string | null {
    return this.schoolId;
  }

  clearSchoolId(): void {
    this.schoolId = null;
  }

  // Setters and getters for teacherId
  setTeacherId(id: string): void {
    this.teacherId = id;
  }

  getTeacherId(): string | null {
    return this.teacherId;
  }

  clearTeacherId(): void {
    this.teacherId = null;
  }

  // Setters and getters for userId (which is used as tsc-id)
  setUserId(id: string): void {
    console.log('Setting TSC ID in SharedService:', id); // Debug log
    this.userId = id;
  }
  
  getUserId(): string | null {
    console.log('Getting TSC ID from SharedService:', this.userId); // Debug log
    return this.userId;
  }
  
  clearUserId(): void {
    this.userId = null;
  }
  
  setSelectedOrganization(id: string, name: string): void {
    this.selectedOrganizationId = id;
    this.selectedOrganizationName = name;
  }

  getSelectedOrganization(): { id: string | null; name: string | null } {
    return { id: this.selectedOrganizationId, name: this.selectedOrganizationName };
  }

  
}
