import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from '../login/services/auth.service';

// NgRx need to store and select
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUserCount } from '../store/user.selectors';
import * as UserActions from '../store/user.actions';
import { UserService } from '../user/services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isSmallScreen: boolean = false;
  userCount$: Observable<number>;

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver, 
    private router: Router,
    public auth: AuthService,
    private userService: UserService
  ) {
    this.userCount$ = this.store.pipe(select(selectUserCount));
    console.log('>> userCount$', this.userCount$);
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
    this.userService.getUsers().subscribe((res: any[])=>{
      const users = res.filter(user => user && Object.keys(user).length > 0);
      this.store.dispatch(UserActions.setUsers({ users: users }));
      return users;
    });
  }

  
  logout() {
    localStorage.removeItem('token'); // or sessionStorage
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
