import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    const user = this.authService.getCurrentUser();
    if (user?.role === 'teacher' || user?.role === 'admin') {
      return true;
    }
    
    this.router.navigate(['/student/quiz-list']);
    return false;
  }
}