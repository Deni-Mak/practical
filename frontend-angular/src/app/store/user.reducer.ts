import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';

export interface UserState {
  users: any[];
}
export const initialState: UserState = { users: [] };

export const userReducer = createReducer(
  initialState,
  on(UserActions.setUsers, (state, { users }) => ({ ...state, users })),
  on(UserActions.addUser, (state, { user }) => ({ ...state, users: [...state.users, user] })),
  on(UserActions.updateUser, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u)
  })),
  on(UserActions.deleteUser, (state, { id }) => ({
    ...state,
    users: state.users.filter(u => u._id !== id)
  }))
);
