import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  static readonly USER_LOCAL_STORAGE_KEY = 'user';
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  currentRoles = computed(() => {
    const user = this.currentUser();
    if(user && user.token){
      const roles = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(roles) ? roles : [roles];
    }
    return [];
  })

  constructor(private http: HttpClient, private presenceService: PresenceService) { }

  login(model: any){
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
  }

  setCurrentUser(user: User){
    user.roles = [];
    const roles = this.getDecodedToke(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem(AccountService.USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
    this.currentUser.set(user);
    this.presenceService.createHubConnection(user);
  }

  logout(){
    localStorage.removeItem(AccountService.USER_LOCAL_STORAGE_KEY);
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
  }

  getDecodedToke(token: string){
    return JSON.parse(atob(token.split('.')[1]))
  }
}
