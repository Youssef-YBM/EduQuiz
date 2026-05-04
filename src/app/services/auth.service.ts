import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'eduquiz_current_user';
  private readonly USERS_KEY = 'eduquiz_users';

  constructor(private router: Router) {
    this.loadCurrentUser();
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers(): void {
    let users = this.getUsersFromStorage();
    
    if (users.length === 0) {
      users = [
        {
          id: 'admin1',
          email: 'admin@eduquiz.ma',
          name: 'Alex Admin',
          role: 'admin',
          banned: false,
          createdAt: new Date()
        },
        {
          id: 'teacher1',
          email: 'teacher@eduquiz.ma',
          name: 'Pierre Teacher',
          role: 'teacher',
          banned: false,
          createdAt: new Date()
        },
        {
          id: 'student1',
          email: 'student@eduquiz.ma',
          name: 'Sara Student',
          role: 'student',
          banned: false,
          createdAt: new Date()
        },
        {
          id: 'student2',
          email: 'john@eduquiz.ma',
          name: 'John Doe',
          role: 'student',
          banned: false,
          createdAt: new Date()
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  private getUsersFromStorage(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsersToStorage(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private loadCurrentUser(): void {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(credentials: LoginCredentials): AuthResponse {
    const users = this.getUsersFromStorage();
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      return { success: false, message: 'Email non trouvé' };
    }
    
    if (user.banned) {
      return { success: false, message: 'Ce compte a été banni' };
    }
    
    this.currentUser = user;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    
    return { success: true, user: user };
  }

  register(name: string, email: string, role: 'student' | 'teacher'): AuthResponse {
    const users = this.getUsersFromStorage();
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Cet email est déjà utilisé' };
    }
    
    const newUser: User = {
      id: 'user_' + Date.now(),
      email: email,
      name: name,
      role: role,
      banned: false,
      createdAt: new Date()
    };
    
    users.push(newUser);
    this.saveUsersToStorage(users);
    
    this.currentUser = newUser;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  getAllUsers(): User[] {
    return this.getUsersFromStorage();
  }

  updateUserRole(userId: string, newRole: 'student' | 'teacher'): boolean {
    const users = this.getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return false;
    
    users[userIndex].role = newRole;
    this.saveUsersToStorage(users);
    return true;
  }

  toggleBanUser(userId: string): boolean {
    const users = this.getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return false;
    
    users[userIndex].banned = !users[userIndex].banned;
    this.saveUsersToStorage(users);
    return true;
  }

  deleteUser(userId: string): boolean {
    let users = this.getUsersFromStorage();
    users = users.filter(u => u.id !== userId);
    this.saveUsersToStorage(users);
    return true;
  }
}