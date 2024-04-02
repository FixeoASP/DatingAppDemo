import { Component } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginatedResult } from 'src/app/_models/paginatedResult';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent {
  // members$: Observable<PaginatedResult<Member[]>> | undefined; 
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams : UserParams | undefined;
  user: User | undefined;

  constructor(private memberService: MembersService, private accountService: AccountService){
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user){
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    })
  }

  ngOnInit(): void{
    // this.members$ = this.memberService.getMembers();
    this.loadMember();
  }

  loadMember(){
    if(!this.userParams) return;
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
      this.loadMember();
    }
  }
}
