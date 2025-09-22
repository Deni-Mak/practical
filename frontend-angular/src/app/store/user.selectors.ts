import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserList = createSelector(
    selectUserState,
    (state: UserState) => state.users
);
  
// ✅ Selector for count
export const selectUserCount = createSelector(
    selectUserState,
    (state: UserState) => state.users.length
);
