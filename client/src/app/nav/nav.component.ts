import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { APP_ROUTES } from '../app-routing.module';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HasRoleDirective } from '../_directives/has-role.directive';
import { NgIf, AsyncPipe, TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgIf, HasRoleDirective, BsDropdownModule, FormsModule, AsyncPipe, TitleCasePipe]
})
export class NavComponent implements OnInit{
  model: any = {};
  APP_ROUTES = APP_ROUTES;

  constructor(public accountService: AccountService, private router: Router,
    private toastr: ToastrService) {}

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl(`/${APP_ROUTES.ROUTE_MEMBERS}`);
        this.model = {};
      }
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
