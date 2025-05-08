import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Detect browser refresh using Performance API
    const isPageReload = performance.getEntriesByType('navigation').some((nav) => 
      (nav as PerformanceNavigationTiming).type === 'reload'
    );

    if (isPageReload) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        return of(true); // Allow access if userId exists in localStorage
      }
    }

    // Otherwise, check authentication normally
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
