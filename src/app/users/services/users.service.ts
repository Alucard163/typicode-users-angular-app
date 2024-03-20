import { Injectable } from '@angular/core';
import { User } from "../interfaces/user.interface";
import { LocalStorageService } from "./local-storage.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private localStorageKey = 'users';
  public users: User[] = [];
  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(
    private localStorageService: LocalStorageService
  ) {
    const storedUsers = localStorageService.getItem(this.localStorageKey);

    if (storedUsers) {
      this.setUsers(JSON.parse(storedUsers));
    }
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  setUsers(users: User[]): void {
    this.users = users;
    this.localStorageService.setItem(this.localStorageKey, JSON.stringify(this.users));
    this.usersSubject.next(users);
  }

  addUser(user: User): void {
    this.users = [...this.users, user];
    this.localStorageService.setItem(this.localStorageKey, JSON.stringify(this.users));
    this.usersSubject.next(this.users);
  }

  editUser(updatedUser: User): void {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      this.localStorageService.setItem(this.localStorageKey, JSON.stringify(this.users));
      this.usersSubject.next(this.users);
    }
  }

  removeUser(userId: number): void {
    this.users = this.users.filter(user => user.id !== userId);
    this.localStorageService.setItem(this.localStorageKey, JSON.stringify(this.users));
    this.usersSubject.next(this.users);
  }
}
