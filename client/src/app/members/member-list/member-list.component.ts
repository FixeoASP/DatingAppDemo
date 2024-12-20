import { Component } from '@angular/core';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginatedResult } from 'src/app/_models/paginatedResult';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MemberCardComponent } from '../member-card/member-card.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css'],
    standalone: true,
    imports: [NgIf, FormsModule, NgFor, ButtonsModule, MemberCardComponent, PaginationModule]
})
export class MemberListComponent {
  // members$: Observable<PaginatedResult<Member[]>> | undefined; 
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams : UserParams | undefined;
  genderList = [
    {value: 'male', display: 'Males'},
    {value: 'female', display: 'Females'}
  ];

  constructor(private memberService: MembersService){
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void{
    // this.members$ = this.memberService.getMembers();
    this.loadMember();
  }

  loadMember(){
    if(!this.userParams) return;
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe({
      next: response => {
        if(response.result && response.pagination){
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    })
  }

  pageChanged(event: PageChangedEvent){
    if(this.userParams && this.userParams.pageNumber  !== event.page){
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMember();
    }
  }

  resetFilters(){
    this.userParams = this.memberService.resetUserParams();
    this.loadMember();
  }
}
