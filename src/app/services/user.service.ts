import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private authService: AuthService) {}

  getAllUsers(): User[] {
    return this.authService.getAllUsers();
  }

  getUserById(id: string): User | undefined {
    return this.getAllUsers().find(u => u.id === id);
  }

  updateUserRole(userId: string, newRole: 'student' | 'teacher'): boolean {
    return this.authService.updateUserRole(userId, newRole);
  }

  toggleBanUser(userId: string): boolean {
    return this.authService.toggleBanUser(userId);
  }

  deleteUser(userId: string): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id === userId) return false;
    return this.authService.deleteUser(userId);
  }
}