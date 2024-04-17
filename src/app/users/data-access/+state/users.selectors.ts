import { createFeatureSelector, createSelector } from "@ngrx/store";
import { usersFeatureKey, UsersState } from "./users.reducers";

export const selectUsersState = createFeatureSelector<UsersState>(usersFeatureKey);

export const selectUsers = createSelector(
  selectUsersState,
  (state) => state.users
)
