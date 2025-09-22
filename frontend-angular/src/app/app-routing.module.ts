import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

// ✅ Import components from UserModule
import { UserListComponent } from './user/components/user-list/user-list.component';
import { LoginComponent } from './login/component/login.component';
import { AuthGuard } from './login/services/auth.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', component: LayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'user', loadChildren: () => import('./user/user-routing.module').then(m => m.UserRoutingModule) }
    ]
  },
  //{ path: 'user', component: UserListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
