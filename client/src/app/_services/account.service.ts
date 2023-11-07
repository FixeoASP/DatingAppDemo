import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { IUser } from '../_models/user';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  static readonly USER_LOCAL_STORAGE_KEY = 'user';
  baseUrl = 'https://localhost:5001/api/';
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post<IUser>(this.baseUrl + 'account/login', model).pipe(
      map((response: IUser) => {
        const user = response;
        localStorage.setItem(AccountService.USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
        this.currentUserSource.next(user);
      })
    );
  }

  setCurrentUser(user: IUser){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem(AccountService.USER_LOCAL_STORAGE_KEY);
    this.currentUserSource.next(null);
  }
}
