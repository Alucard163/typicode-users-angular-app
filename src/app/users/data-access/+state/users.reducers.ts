import { createFeature, createReducer, on } from '@ngrx/store';
import * as usersActions from './users.action';
import { User } from '../../interfaces/user.interface';

export const usersFeatureKey = 'users';

export interface UsersState{
  users: User[],
}

export const initialState: UsersState = {
  users: [],
}

export const userFeature = createFeature({
  name: usersFeatureKey,
  reducer: createReducer(
    initialState,
    on(usersActions.getUsersSuccess, (state, { users }) => ({
      ...state,
      users: users,
    })),
    on(usersActions.setUsers, (state, { users}) => ({
      ...state,
      users: users,
    })),
    on(usersActions.createUsers, (state, { user }) => ({
      ...state,
      users: [...state.users, {...user, id: state.users.length + 1} ]
    })),
    on(usersActions.deleteUsersSuccess, (state, { userId }) => ({
      ...state,
      users: state.users.filter(user => user.id !== userId),
    })),
    on(usersActions.editUsers, (state, {  editUser, id }) => ({
      ...state,
      users: state.users.map( user => user.id === id ? {...user, ...editUser } : user )
    })),
  )
})
