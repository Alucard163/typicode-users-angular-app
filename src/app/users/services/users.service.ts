import { Injectable } from '@angular/core';
import { User } from "../interfaces/user.interface";
import { LocalStorageService } from "./local-storage.service";
import {BehaviorSubject,  Observable } from "rxjs";
import { LOCAL_STORAGE_USERS_KEY } from "../../core/constants/storage-keys.constant";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private localStorageKey = LOCAL_STORAGE_USERS_KEY;
  public users: User[] = [];
  private users$$  = new BehaviorSubject<User[]>([]);

  constructor(
    private localStorageService: LocalStorageService
  ) {
   try {
     const storedUsers = localStorageService.getItem(this.localStorageKey);

     if (storedUsers) {
       this.setUsers(this.parseUsers(storedUsers));
     }
   } catch (error) {
     console.error('Error parsing users from localStorage', error);
   }
  }

  private parseUsers(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing users JSON string', error);
      throw error;
    }
  }

  private stringifyUsers(users: unknown): string {
    try {
      return JSON.stringify(users);
    } catch (error) {
      console.error('Error stringifying users', error);
      throw error;
    }
  }

  getUsers(): Observable<User[]> {
    return this.users$$.asObservable();
  }

  setUsers(users: User[]): void {
    this.users = users;
    try {
      this.localStorageService.setItem(this.localStorageKey, this.stringifyUsers(this.users));
      this.users$$.next(users);
    } catch (error) {
      console.error('Error saving users to localStorage', error);
    }
  }

  addUser(user: User): void {
    this.users = [...this.users, user];
    this.localStorageService.setItem(this.localStorageKey, this.stringifyUsers(this.users));
    this.users$$.next(this.users);
  }

  editUser(updatedUser: User): void {
    if (updatedUser.id) {
      this.users = this.users.map(user => {
        return user.id === updatedUser.id
          ? {...user, ...updatedUser}
          : user
      })
    } else {
      this.users = [
        ...this.users,
        {...updatedUser, id: this.users.length + 1}
      ]
    }
    this.localStorageService.setItem(this.localStorageKey, this.stringifyUsers(this.users));
    this.users$$.next(this.users);
  }

  removeUser(userId: number): void {
    this.users = this.users.filter(user => user.id !== userId);
    this.localStorageService.setItem(this.localStorageKey, this.stringifyUsers(this.users));
    this.users$$.next(this.users);
  }
}
