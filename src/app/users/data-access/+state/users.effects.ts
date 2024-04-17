import { inject } from "@angular/core";
import {catchError, map, of, switchMap, tap, withLatestFrom} from "rxjs";

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { selectUsers } from "./users.selectors";
import * as UserAction from './users.action';

import { User } from "../../interfaces/user.interface";
import { UsersApiService } from "../../services/users-api.service";
import { LocalStorageService } from "../../services/local-storage.service";
import { UsersService } from "../../services/users.service";

import { stringifyJSON } from "../../shared/helpers/localStorageHelpers";
import { LOCAL_STORAGE_USERS_KEY } from "../../../core/constants/storage-keys.constant";


export const getUsers = createEffect(
  () => {
    const action = inject(Actions);
    const usersService = inject(UsersService);

    return action.pipe(
      ofType(UserAction.getUsers),
      switchMap(
        () => usersService.initUsers().pipe(
          map((users) => UserAction.getUsersSuccess({users})),
          catchError((error) => {
            console.log('Error ' + error.message);
            return of(UserAction.getUsersFailure({error}))
          })
        )
      )
    )
  },
  { functional: true, dispatch: false }
)

export const setUsers = createEffect(
  () => {
    const action = inject(Actions);
    const localStorageService = inject(LocalStorageService);

    return action.pipe(
      ofType(UserAction.setUsers),
      tap(({users}) =>{
        localStorageService.setItem(LOCAL_STORAGE_USERS_KEY, stringifyJSON(users));
        UserAction.setUsersSuccess({users});
      }),
      catchError(error => of(UserAction.setUsersFailure({ error })))
    )
  },
  { functional: true, dispatch: false }
);

export const deleteUsers = createEffect(
  () => {
    const action = inject(Actions);
    const store = inject(Store);
    const localStorageService = inject(LocalStorageService);
    const apiService = inject(UsersApiService);
    const localStorageKey = LOCAL_STORAGE_USERS_KEY;

    return action.pipe(
      ofType(UserAction.deleteUsers),
      withLatestFrom(store.select(selectUsers)),
      switchMap(
        ([{userId}, users]) => apiService.deleteUser<void>(userId).pipe(
          map(() => {
            const updatedUsers = users.filter(user => user.id !== userId);
            localStorageService.setItem(localStorageKey, stringifyJSON(updatedUsers));

            return UserAction.deleteUsersSuccess({ userId });
          }),
          catchError(error => of(UserAction.deleteUsersFailure({ error })))
        )
      )
     )
  },
  { functional: true }
)

export const createUsers = createEffect(
  () => {
    const action = inject(Actions);
    const store = inject(Store);
    const apiService = inject(UsersApiService);
    const localStorageService = inject(LocalStorageService);

    return action.pipe(
      ofType(UserAction.createUsers),
      withLatestFrom(store.select(selectUsers)),
      switchMap(
        ([{ user }, users]) => apiService.postUser<User>(user).pipe(
          map(( newUser) => {
            localStorageService.setItem(LOCAL_STORAGE_USERS_KEY, stringifyJSON(users));

            return UserAction.createUsersSuccess({ user: newUser })
          }),
          catchError((error) => {
            console.log('Error ' + error.message);
            return of(UserAction.createUsersFailure({ error }));
          })
        )
      )
    )
  },
  { functional: true, dispatch: false }
)

export const editUser = createEffect(
  () => {
    const action = inject(Actions);
    const store = inject(Store);
    const apiService = inject(UsersApiService);
    const localStorageService = inject(LocalStorageService);

    return action.pipe(
      ofType(UserAction.editUsers),
      withLatestFrom(store.select(selectUsers)),
      switchMap(
        ([{editUser, id}, users]) => apiService.putUser<User>( id, editUser ).pipe(
          map((user) => {
            const updatedUsers = users.map((currentUser) =>
              currentUser.id === user.id ? { ...currentUser, ...user } : currentUser
            );
            localStorageService.setItem(LOCAL_STORAGE_USERS_KEY, stringifyJSON(updatedUsers));

            return UserAction.editUsersSuccess({editUser: user})
          }),
          catchError((error) => {
            console.log('Error ' + error.message);
            if (error.status >= 500) {
              const updatedUsers = users.map((currentUser) =>
                currentUser.id === editUser.id ? { ...currentUser, ...editUser } : currentUser
              );
              localStorageService.setItem(LOCAL_STORAGE_USERS_KEY, stringifyJSON(updatedUsers));
            }
            return of(UserAction.editUsersFailure({ error }));
          })
        )
      )
    )
  },
  { functional: true }
)
