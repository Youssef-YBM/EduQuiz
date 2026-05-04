import { Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { StudentGuard } from './guards/student.guard';
import { TeacherGuard } from './guards/teacher.guard';
import { AdminGuard } from './guards/admin.guard';

import { LoginComponent } from './pages/login/login.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard';

import { QuizListComponent } from './pages/student/quiz-list/quiz-list.component';
import { QuizPlayComponent } from './pages/student/quiz-play/quiz-play.component';
import { QuizResultComponent } from './pages/student/quiz-result/quiz-result.component';
import { HistoryComponent } from './pages/student/history/history.component';

import { MyQuizzesComponent } from './pages/teacher/my-quizzes/my-quizzes.component';
import { QuizFormComponent } from './pages/teacher/quiz-form/quiz-form.component';
import { QuizScoresComponent } from './pages/teacher/quiz-scores/quiz-scores';

import { AllQuizzesComponent } from './pages/admin/all-quizzes/all-quizzes';
import { UserManagementComponent } from './pages/admin/user-management/user-management';
import { AllScoresComponent } from './pages/admin/all-scores/all-scores';

// EXPORTER la constante routes (supprimer le mot-clé const, utiliser export const)
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
  
  {
    path: 'student',
    canActivate: [StudentGuard],
    children: [
      { path: 'quiz-list', component: QuizListComponent },
      { path: 'quiz-play/:id', component: QuizPlayComponent },
      { path: 'quiz-result/:id', component: QuizResultComponent },
      { path: 'history', component: HistoryComponent },
      { path: '', redirectTo: 'quiz-list', pathMatch: 'full' }
    ]
  },
  
  {
    path: 'teacher',
    canActivate: [TeacherGuard],
    children: [
      { path: 'my-quizzes', component: MyQuizzesComponent },
      { path: 'quiz-form/:id', component: QuizFormComponent },
      { path: 'quiz-scores', component: QuizScoresComponent },
      { path: '', redirectTo: 'my-quizzes', pathMatch: 'full' }
    ]
  },
  
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: 'all-quizzes', component: AllQuizzesComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'all-scores', component: AllScoresComponent },
      { path: '', redirectTo: 'all-quizzes', pathMatch: 'full' }
    ]
  },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];