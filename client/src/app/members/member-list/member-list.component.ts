import { Component } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginatedResult } from 'src/app/_models/paginatedResult';
import { Pagination } from 'src/app/_models/pagination';
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
  pageNumber = 1;
  pageSize = 5;

  constructor(private memberService: MembersService){}

  ngOnInit(): void{
    // this.members$ = this.memberService.getMembers();
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
      next: response => {
        if(response.result && response.pagination){
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    })
  }

  pageChanged(event: PageChangedEvent){
    if(this.pageNumber  !== event.page){
      this.pageNumber = event.page;
      this.loadMember();
    }
  }
}
