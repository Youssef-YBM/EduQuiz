import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})


export class UserManagementComponent implements OnInit {
  users: User[] = [];
  currentUserId: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.currentUserId = this.authService.getCurrentUser()?.id || '';
  }

  loadUsers(): void {
    this.users = this.userService.getAllUsers();
  }

  toggleBan(user: User): void {
    if (user.id === this.currentUserId) {
      alert('Vous ne pouvez pas vous bannir vous-même');
      return;
    }
    this.userService.toggleBanUser(user.id);
    this.loadUsers();
  }

  changeRole(user: User, newRole: 'student' | 'teacher'): void {
    if (user.id === this.currentUserId) {
      alert('Vous ne pouvez pas modifier votre propre rôle');
      return;
    }
    this.userService.updateUserRole(user.id, newRole);
    this.loadUsers();
  }

  deleteUser(user: User): void {
    if (user.id === this.currentUserId) {
      alert('Vous ne pouvez pas supprimer votre propre compte');
      return;
    }
    if (confirm(`Supprimer l'utilisateur "${user.name}" ?`)) {
      this.userService.deleteUser(user.id);
      this.loadUsers();
    }
  }

  getRoleBadge(role: string): string {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'teacher': return 'bg-warning';
      case 'student': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
}