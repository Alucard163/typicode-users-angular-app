import { createAction, props } from "@ngrx/store";
import { User } from "../../interfaces/user.interface";


export const getUsers = createAction('[Users] Get Users');
export const getUsersSuccess = createAction('[Users] Get Users Success', props<{ users: User[] }>());
export const getUsersFailure = createAction('[Users] Get Users Failure', props<{ error: string }>());

export const setUsers = createAction('[] Set Users', props<{ users: User[] }>());
export const setUsersSuccess = createAction('[Users] Set Users Success', props<{ users: User[] }>());
export const setUsersFailure = createAction('[Users] Set Users Failure', props<{ error: string }>());

export const deleteUsers = createAction('[Users] Delete User', props<{ userId: number }>());
export const deleteUsersSuccess = createAction('[Users] Delete User Success', props<{ userId: number }>());
export const deleteUsersFailure = createAction('[Users] Delete User Failure', props<{ error: string }>());

export const createUsers = createAction('[Users] Create User', props<{ user: User }>());
export const createUsersSuccess = createAction('[Users] Create User Success', props<{ user: User }>());
export const createUsersFailure = createAction('[Users] Create User Failure', props<{ error: string }>());

export const editUsers = createAction('[Users] Edit User', props<{ editUser: User, id: number }>());
export const editUsersSuccess = createAction('[Users] Edit User Success', props<{ editUser: User }>());
export const editUsersFailure = createAction('[Users] Edit User Failure', props<{ error: string }>());
