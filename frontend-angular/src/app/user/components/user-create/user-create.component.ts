import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


import { Store } from '@ngrx/store';
import * as UserActions from '../../../store/user.actions';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent {
  userForm: FormGroup;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }
  
  showSuccess() {
    this.snackBar.open('User created successfully!', 'Close', {
      duration: 3000, // milliseconds
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'] // optional CSS class
    });
  }

  showError(error: any) {
    this.snackBar.open(`${error.error.message?error.error.message: error}`, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  onSubmit(event?: Event) {
    if (event) event.preventDefault();
    
    if (this.userForm.invalid){
      this.userForm.markAllAsTouched();
      return;
    } 
    
    this.userService.createUser(this.userForm.value).subscribe({
      next: (response) => {
        this.showSuccess();
        this.store.dispatch(UserActions.addUser({ user: response }));
        this.userForm.reset({
          name: '',
          email: '',
          password: ''
        });
        this.router.navigate(['/user']);
      },
      error: (err) => {
        this.showError(err);
      }
    });
  
  }
}
