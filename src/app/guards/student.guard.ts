import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    const user = this.authService.getCurrentUser();
    if (user?.role === 'student') {
      return true;
    }
    
    if (user?.role === 'teacher') {
      this.router.navigate(['/teacher/my-quizzes']);
    } else if (user?.role === 'admin') {
      this.router.navigate(['/admin/all-quizzes']);
    }
    return false;
  }
}