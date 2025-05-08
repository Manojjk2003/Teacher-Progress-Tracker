import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CorrectionsService } from './corrections.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../teacher-dashboard/teacher-dashboard.service';

@Component({
  selector: 'app-corrections',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './corrections.component.html',
  styleUrls: ['./corrections.component.css']
})
export class CorrectionsComponent implements OnInit {
  projectLink: string | null = '';
  safeProjectLink: SafeResourceUrl | null = null;
  projectType: 'teacher' | 'student' = 'teacher';
  metrics: { name: string; value: number; isEditable: boolean }[] = [];
  isEditing: boolean = false;
  breadcrumb: { name: string; link: string }[] = []; // Store the fetched breadcrumb

  feedback: string = '';
  totalScore: number = 0;
  userId: string | null = null;
  status: string = 'Pending';
  
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private correctionService: CorrectionsService,
    private authService: AuthService,
    private http: HttpClient,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    // Fetch user details
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user?.uid) {
          this.userId = user.uid;
          
        } else {
          console.error('User is not authenticated');
        }
      },
      error: (err) => {
        console.error('Error fetching user ID:', err);
      },
    });

    // Fetch query parameters
    this.route.queryParams.subscribe((params) => {
      this.projectLink = params['link'] || '';
      this.projectType = params['type'] === 'student' ? 'student' : 'teacher';
      const scoresString = params['scores'];
      this.status = params['status'] || 'pending';
      const organizationName = params['organizationName'] || 'Unknown Organization';
      const schoolName = params['schoolName'] || 'Unknown School';
      const teacherName = params['teacherName'] || 'Unknown Teacher'; // Initialize status from query params

      if (scoresString) {
        try {
          const scores = JSON.parse(scoresString);
          this.setMetricsValues(scores);
        } catch (err) {
          console.error('Error parsing scores:', err);
        }
      }

      this.feedback = params['feedback'] || '';
      this.setSafeProjectLink();
      this.updateBreadcrumb(organizationName, schoolName, teacherName);
    });
  }

  updateBreadcrumb(organizationName: string, schoolName: string, teacherName: string) {
    this.breadcrumb = [
      
      { 
        name: this.projectType === 'teacher' ? 'Teacher Project' : 'Student Project', 
        link: ''  // No link for the last item
      }
    ];
  }


  capitalizeFirstLetter(str: string): string {
    return str
      ? str
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : '';
  }
  setMetricsValues(scores: any) {
    this.metrics = [
      { name: 'Creativity', value: scores?.creativity || 0, isEditable: false },
      { name: 'Originality of Code', value: scores?.originality_of_code || 0, isEditable: false },
      { name: 'Animations & Sounds', value: scores?.animations_sounds || 0, isEditable: false },
      { name: 'Code Complexity', value: scores?.code_complexity || 0, isEditable: false },
      { name: 'Usage of Sprities & Backdrops', value: scores?.usage_of_spr_bd || 0, isEditable: false },
     
    ];
    this.calculateTotalScore(); // After setting metrics, calculate the total score
  }

  calculateTotalScore() {
    this.totalScore = this.metrics.reduce((acc, metric) => acc + metric.value, 0);
  }
    
  

  setSafeProjectLink() {
    if (this.projectLink) {
      // Transform the project link to the embed format
      const embedLink = this.projectLink.replace('/projects/', '/projects/') + '/embed';
      // Sanitize the transformed embed link
      this.safeProjectLink = this.sanitizer.bypassSecurityTrustResourceUrl(embedLink);
    }
  }

  // "See Inside" functionality
  onSeeInside() {
    if (this.projectLink) {
      window.open(this.projectLink, '_blank');
    } else {
      console.error('No project link available.');
    }
  }

  onBreadCrumbClick() {
    console.log(`Breadcrumb clicked: ${this.breadcrumb}`);
    if (this.projectType === 'teacher') {
      console.log('Navigate to teacher project view.');
    } else {
      console.log('Navigate to student project view.');
    }
  }

  showPopup(message: string, type: 'success' | 'error') {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.backgroundColor = type === 'success' ? 'green' : 'red';
    popup.style.color = 'white';
    popup.style.fontSize = '14px';
    popup.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '1000';

    document.body.appendChild(popup);

    setTimeout(() => {
      document.body.removeChild(popup);
    }, 2000);
  }
}
