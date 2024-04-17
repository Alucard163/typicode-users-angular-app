import { inject, Injectable } from '@angular/core';

import { User } from "../interfaces/user.interface";
import { LocalStorageService } from "./local-storage.service";
import { UsersApiService } from "./users-api.service";
import { UsersListFacade } from "../data-access/+state/users.facade";
import { LOCAL_STORAGE_USERS_KEY } from "../../core/constants/storage-keys.constant";

import { of, tap } from "rxjs";

import { parseJSON } from "../shared/helpers/localStorageHelpers";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private localStorageKey = LOCAL_STORAGE_USERS_KEY;
  private usersListFacade = inject(UsersListFacade);
  private parseJSON = parseJSON;

  constructor(
    private localStorageService: LocalStorageService,
    private usersApiService: UsersApiService,
  ) {}

  initUsers() {
    try {
      const storedUsers = this.localStorageService.getItem(this.localStorageKey);

      if (storedUsers) {
        this.usersListFacade.setUsers(this.parseJSON(storedUsers));

        return of(this.parseJSON(storedUsers));
      } else {
        return this.usersApiService.getUsers()
          .pipe(
            tap((users: User[]) => this.usersListFacade.setUsers(users)),
          )
      }
    } catch (error) {
      console.error('Error parsing users from localStorage', error);
      throw error;
    }
  }
}
