// user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Store } from '@ngrx/store';
import { selectUserList } from '../../../store/user.selectors';
import { Observable } from 'rxjs';
import * as UserActions from '../../../store/user.actions';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  userList$!: Observable<any[]>;

  constructor(
    private userService: UserService,
    private router: Router,
    private store: Store<{ user: { users: any[] } }>,  
  ) {
  }

  updateUsersList(res: any) {
    console.log('>> updateUsersList res', res);
    this.store.dispatch(UserActions.deleteUser({ id: res.id }));
  }

  ngOnInit() {
    this.store.select(selectUserList).subscribe(users => {
      this.users = users;
    });
  }

  addUser() {
    // Navigate to a "create user" page or open a dialog
    this.router.navigate(['/user/create']); 
    // Or you can open a modal/dialog here
  }

  editUser(user: any) {
    this.router.navigate(['/user/edit', user._id]); // navigate to edit form with ID
  }

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.userService.deleteUser(user._id).subscribe({
        next: (res) => this.updateUsersList(res), // refresh table after deletion
        error: (err) => console.error(err)
      });
    }
  }
}
