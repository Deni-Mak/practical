import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
//import { LoginRoutingModule } from '../component/login-routing.module'; // your routing

//import { LoginComponent } from './component/login.component';

@NgModule({
  declarations: [
    //LoginComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,    // ✅ must import here
    MatFormFieldModule,     // ✅ Material modules
    MatInputModule,
    MatButtonModule,
  //  LoginRoutingModule
  ]
})
export class LoginModule {}
