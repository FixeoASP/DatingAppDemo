import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { IUser } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'Dating App Demo';
  
  constructor(private accountService: AccountService){}
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const userString = localStorage.getItem(AccountService.USER_LOCAL_STORAGE_KEY);
    if(!userString) return;
    const user : IUser = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
