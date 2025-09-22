import { createAction, props } from '@ngrx/store';

export const addUser = createAction('[User] Add User', props<{ user: any }>());
export const updateUser = createAction('[User] Update User', props<{ user: any }>());
export const deleteUser = createAction('[User] Delete User', props<{ id: string }>());
export const setUsers = createAction('[User] Set Users', props<{ users: any[] }>());

