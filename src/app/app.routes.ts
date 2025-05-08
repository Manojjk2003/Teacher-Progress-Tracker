import { Routes } from '@angular/router';
import { TscNavbarComponent } from './tsc/tsc-navbar/tsc-navbar.component';
import { AssignSchoolComponent } from './tsc/assign-school/assign-school.component';
import { AssignTeacherComponent } from './tsc/assign-teacher/assign-teacher.component';
import { CorrectionComponent } from './tsc/correction/correction.component';
import { TeacherNavbarComponent } from './teachers/teacher-navbar/teacher-navbar.component';
import { TeacherDashboardComponent } from './teachers/teacher-dashboard/teacher-dashboard.component';
import { UploadComponent } from './teachers/upload/upload.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminNavbarComponent } from './admin/admin-navbar/admin-navbar.component';
import { EvalutionComponent } from './admin/evalution/evalution.component';
import { AddSchoolComponent } from './admin/add-school/add-school.component';
import { TscComponent } from './admin/tsc/tsc.component';


import { TeacherComponent } from './admin/teacher/teacher.component';
import { AddTeacherComponent } from './admin/add-teacher/add-teacher.component';
import { TotalTeacherComponent } from './admin/total-teacher/total-teacher.component';
import { SchoolsComponent } from './admin/schools/schools.component';
import { TscDashboardComponent } from './tsc/tsc-dashboard/tsc-dashboard.component';
import { LoginComponent } from './component/login/login.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { UserdetailsComponent } from './component/userdetails/userdetails.component';
import { TscTeacherdashboardComponent } from './tsc/tsc-teacherdashboard/tsc-teacherdashboard.component';
import { SchoolTeachersComponent } from './admin/school-teachers/school-teachers.component';
import { AdminTeacherdashboardComponent } from './admin/admin-teacherdashboard/admin-teacherdashboard.component';
import { AdminCorrectionComponent } from './admin/admin-correction/admin-correction.component';
import { AddOrganizationComponent } from './admin/add-organization/add-organization.component';
import { OrganizationComponent } from './admin/organization/organization.component';
import { TSCFormComponent } from './admin/tsc-form/tsc-form.component';
import { CorrectionsComponent } from './teachers/corrections/corrections.component';
import { AllOrganizationComponent } from './admin/all-organization/all-organization.component';
import { AssignOrganizationComponent } from './tsc/assign-organization/assign-organization.component';
import { AuthGuard } from '../services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'userdetails', component: UserdetailsComponent },

  // Admin Routes
  {
    path: 'admin-navbar',
    component: AdminNavbarComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' }, // Restrict to admin
    children: [
      { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'evalution', component: EvalutionComponent },
      { path: 'add-school', component: AddSchoolComponent },
      { path: 'userdetails', component: UserdetailsComponent },
      { path: 'schools', component: SchoolsComponent },
      { path: 'tsc', component: TscComponent },
      { path: 'tsc-form', component: TSCFormComponent },
      { path: 'teacher', component: TeacherComponent },
      { path: 'add-teacher', component: AddTeacherComponent },
      { path: 'total-teacher/:schoolId', component: TotalTeacherComponent },
      { path: 'correction', component: CorrectionComponent },
      { path: 'school-teachers', component: SchoolTeachersComponent },
      { path: 'assign-teacher', component: AssignTeacherComponent },
      { path: 'admin-teacherdashboard', component: AdminTeacherdashboardComponent },
      { path: 'admin-correction', component: AdminCorrectionComponent },
      { path: 'add-organization', component: AddOrganizationComponent },
      { path: 'organization', component: OrganizationComponent },
      { path: 'all-organization', component: AllOrganizationComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
    ]
  },

  // TSC Routes
  {
    path: 'tsc-navbar',
    component: TscNavbarComponent,
    canActivate: [AuthGuard],
    data: { role: 'tsc' }, // Restrict to TSC
    children: [
      { path: '', redirectTo: 'tsc-dashboard', pathMatch: 'full' },
      { path: 'assign-school', component: AssignSchoolComponent },
      { path: 'assign-teacher', component: AssignTeacherComponent },
      { path: 'correction', component: CorrectionComponent },
      { path: 'userdetails', component: UserdetailsComponent },
      { path: 'tsc-dashboard', component: TscDashboardComponent },
      { path: 'tsc-teacherdashboard', component: TscTeacherdashboardComponent },
      { path: 'assign-organization', component: AssignOrganizationComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
    ]
  },

  // Teacher Routes
  {
    path: 'teacher-navbar',
    component: TeacherNavbarComponent,
    canActivate: [AuthGuard],
    data: { role: 'teacher' }, // Restrict to teacher
    children: [
      { path: '', redirectTo: 'teacher-dashboard', pathMatch: 'full' },
      { path: 'teacher-dashboard', component: TeacherDashboardComponent },
      { path: 'upload', component: UploadComponent },
      { path: 'userdetails', component: UserdetailsComponent },
      { path: 'corrections', component: CorrectionsComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
    ]
  },

  
];
