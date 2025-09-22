import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  
  private headers: any;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token'); // get token
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`, { headers: this.headers });
  }

  getUser(id: string): Observable<User> {
    
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, JSON.stringify(user)
    , { headers: this.headers });
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/edit/${id}`, user
    , { headers: this.headers });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }
}
