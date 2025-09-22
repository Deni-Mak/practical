import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AuthGuard } from '../login/services/auth.guard';

const routes: Routes = [
  { path: '', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: UserCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },
  { path: 'details/:id', component: UserDetailsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
