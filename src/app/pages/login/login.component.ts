import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})


export class LoginComponent {
  email: string = '';
  name: string = '';
  showRegister = false;
  registerRole: 'student' | 'teacher' = 'student';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (authService.isLoggedIn()) {
      this.redirectByRole();
    }
  }

  login(): void {
    if (!this.email) {
      this.errorMessage = 'Veuillez entrer votre email';
      return;
    }
    
    const result = this.authService.login({ email: this.email });
    
    if (result.success) {
      this.errorMessage = '';
      this.redirectByRole();
    } else {
      this.errorMessage = result.message || 'Erreur de connexion';
    }
  }

  register(): void {
    if (!this.name || !this.email) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }
    
    const result = this.authService.register(this.name, this.email, this.registerRole);
    
    if (result.success) {
      this.successMessage = 'Inscription réussie ! Redirection...';
      this.errorMessage = '';
      setTimeout(() => {
        this.redirectByRole();
      }, 1500);
    } else {
      this.errorMessage = result.message || 'Erreur d\'inscription';
      this.successMessage = '';
    }
  }

  private redirectByRole(): void {
    const user = this.authService.getCurrentUser();
    
    if (user?.role === 'student') {
      this.router.navigate(['/student/quiz-list']);
    } else if (user?.role === 'teacher') {
      this.router.navigate(['/teacher/my-quizzes']);
    } else if (user?.role === 'admin') {
      this.router.navigate(['/admin/all-quizzes']);
    }
  }

  toggleRegister(): void {
    this.showRegister = !this.showRegister;
    this.errorMessage = '';
    this.successMessage = '';
    this.email = '';
    this.name = '';
  }
}