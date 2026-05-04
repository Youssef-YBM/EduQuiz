import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    const user = this.authService.getCurrentUser();
    if (user?.role === 'admin') {
      return true;
    }
    
    if (user?.role === 'student') {
      this.router.navigate(['/student/quiz-list']);
    } else if (user?.role === 'teacher') {
      this.router.navigate(['/teacher/my-quizzes']);
    }
    return false;
  }
}