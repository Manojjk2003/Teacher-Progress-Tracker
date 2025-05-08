import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdminCorrectionService } from './admin-correction.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-correction',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-correction.component.html',
  styleUrl: './admin-correction.component.css'
})
export class AdminCorrectionComponent implements OnInit {
  projectLink: string | null = '';
  safeProjectLink: SafeResourceUrl | null = null;
  breadcrumb: { name: string; link: string }[] = [];

  projectType: string = '';
  metrics: { name: string; value: number; isEditable: boolean }[] = [];
  feedback: string = '';
  score: number = 0;
  isEditing: boolean = true;
  userId: string | null = null;
  status: string = 'Pending'; // Default status

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private AdminCorrectionService: AdminCorrectionService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
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

    this.route.queryParams.subscribe((params) => {
      this.projectLink = params['link'] || '';
      this.projectType = params['type'] || 'teacher';
      const projectId = params['projectId'];
      const scoresString = params['scores'];
      this.status = params['status'] || 'pending'; // Initialize status from query params
      const organizationName = params['organizationName'] || 'Unknown Organization';
      const schoolName = params['schoolName'] || 'Unknown School';
      const teacherName = params['teacherName'] || 'Unknown Teacher';

      if (scoresString) {
        try {
          const scores = JSON.parse(scoresString);
          this.setMetricsValues(scores);
        } catch (err) {
          console.error('Error parsing scores:', err);
        }
      }

      this.feedback = params['feedback'] || '';
      this.updateBreadcrumb(organizationName, schoolName, teacherName);

      this.setSafeProjectLink();
      this.calculateScore();
    });
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
      { name: 'Creativity', value: scores?.creativity || 0, isEditable: true },
      { name: 'Originality of Code', value: scores?.originality_of_code || 0, isEditable: true },
      { name: 'Animations & Sounds', value: scores?.animations_sounds || 0, isEditable: true },
      { name: 'Code Complexity', value: scores?.code_complexity || 0, isEditable: true },
      { name: 'Usage of Sprities & Backdrops', value: scores?.usage_of_spr_bd || 0, isEditable: true },
    ];
  }

  updateBreadcrumb(organizationName: string, schoolName: string, teacherName: string) {
    this.breadcrumb = [
      { name: organizationName, link: '/admin-navbar/all-organization' },
      { name: schoolName, link: '/admin-navbar/evalution' },
      { name: teacherName, link: '/admin-navbar/school-teachers' },
      { 
        name: this.projectType === 'teacher' ? 'Teacher Project' : 'Student Project', 
        link: ''  // No link for the last item
      }
    ];
  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
  
  

  setSafeProjectLink() {
    if (this.projectLink) {
      // Transform the project link to the embed format
      const embedLink = this.projectLink.replace('/projects/', '/projects/') + '/embed';
      // Sanitize the transformed embed link
      this.safeProjectLink = this.sanitizer.bypassSecurityTrustResourceUrl(embedLink);
    }
  }

  calculateScore() {
    this.score = this.metrics.reduce((acc, metric) => acc + (metric.value || 0), 0);
  }

  validateInput(metric: { value: number | null }) {
    if (metric.value === null || metric.value === undefined) {
      metric.value = 0;
    } else if (metric.value > 10) {
      metric.value = null;
    } else if (metric.value < 0) {
      metric.value = 0;
    }
    this.calculateScore();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.metrics.forEach((metric) => (metric.isEditable = this.isEditing));
  }

  // Submit the scores
  submitScores() {
    const projectId = this.route.snapshot.queryParamMap.get('projectId');
    if (!projectId || !this.userId) {
      console.error('Both projectId and userId are required.');
      return;
    }

    const allScoresValid = this.metrics.every(
      (metric) => metric.value !== null && metric.value >= 0 && metric.value <= 10
    );
    const isFeedbackValid = this.feedback.trim() !== '';

    if (!allScoresValid) {
      this.showPopup('Please ensure all metrics are scored between 0 and 10.', 'error');
      return;
    }

    if (!isFeedbackValid) {
      this.showPopup('Please provide feedback before submitting.', 'error');
      return;
    }

    const scoreData = {
      creativity: this.metrics.find((metric) => metric.name === 'Creativity')?.value || 0,
      code_complexity: this.metrics.find((metric) => metric.name === 'Code Complexity')?.value || 0,
      originality_of_code: this.metrics.find((metric) => metric.name === 'Originality of Code')?.value || 0,
      usage_of_spr_bd: this.metrics.find((metric) => metric.name === 'Usage of Sprities & Backdrops')?.value || 0,
      animations_sounds: this.metrics.find((metric) => metric.name === 'Animations & Sounds')?.value || 0,
      total: this.score,
      feedback: this.feedback,
      evaluated_by: this.userId,
    };

    const postScore$ =
      this.projectType === 'teacher'
        ? this.AdminCorrectionService.postTeacherProjectScore(projectId, this.userId, scoreData)
        : this.AdminCorrectionService.postStudentProjectScore(projectId, this.userId, scoreData);

    postScore$.subscribe({
      next: (response) => {
        this.showPopup('Marks uploaded successfully!', 'success');
        console.log('Server Response:', response);
        this.status = 'completed'; // Update the status to 'completed' after successful submission
      },
      error: (error) => {
        console.error('Error submitting scores:', error);
        this.showPopup('An error occurred while submitting. Please try again later.', 'error');
      },
    });
  }

  // Update the scores
  updateScore() {
    const projectId = this.route.snapshot.queryParamMap.get('projectId');
    if (!projectId || !this.userId) {
      console.error('Both projectId and userId are required.');
      return;
    }

    const allScoresValid = this.metrics.every(
      (metric) => metric.value !== null && metric.value >= 0
    );
    const isFeedbackValid = this.feedback.trim() !== '';

    if (!allScoresValid) {
      this.showPopup('Please enter valid marks for all metrics.', 'error');
      return;
    }

    if (!isFeedbackValid) {
      this.showPopup('Feedback cannot be empty.', 'error');
      return;
    }

    const scoreData = {
      creativity: this.metrics.find((m) => m.name === 'Creativity')?.value,
      originality_of_code: this.metrics.find((m) => m.name === 'Originality of Code')?.value,
      animations_sounds: this.metrics.find((m) => m.name === 'Animations & Sounds')?.value,
      code_complexity: this.metrics.find((m) => m.name === 'Code Complexity')?.value,
      usage_of_spr_bd: this.metrics.find((m) => m.name === 'Usage of Sprities & Backdrops')?.value,
      total: this.score,
      feedback: this.feedback,
      evaluated_by: this.userId,
    };

    const patchScore$ =
      this.projectType === 'teacher'
        ? this.AdminCorrectionService.patchTeacherProjectScore(projectId, this.userId, scoreData)
        : this.AdminCorrectionService.patchStudentProjectScore(projectId, this.userId, scoreData);

    patchScore$.subscribe({
      next: (response) => {
        this.showPopup('Score updated successfully!', 'success');
        console.log('Server Response:', response);
      },
      error: (error) => {
        console.error('Error occurred while updating the score:', error);
        this.showPopup('An error occurred while updating the score. Please try again later.', 'error');
      },
    });
  }

  // "See Inside" functionality to open the project link in a new tab or iframe
  onSeeInside() {
    if (this.projectLink) {
      window.open(this.projectLink, '_blank');
    } else {
      console.error('No project link available.');
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
