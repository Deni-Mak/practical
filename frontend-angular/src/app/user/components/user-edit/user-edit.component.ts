import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
  
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  userId!: string;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.loadUser();
  }

  showSuccess() {
    this.snackBar.open('User updated successfully!', 'Close', {
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

  loadUser(): void {
    this.userService.getUser(this.userId).subscribe(user => {
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        role: user.role
      });
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;
    this.userService.updateUser(this.userId, this.userForm.value).subscribe({
      next: () => {
        this.showSuccess();
        this.router.navigate(['/user']);
      },
      error: (err) => this.showError(err)
    });
  }
}