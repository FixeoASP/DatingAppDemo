import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { SharedModule } from 'src/app/_modules/shared.module';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { APP_ROUTES } from 'src/app/app-routing.module';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports: [CommonModule, SharedModule]
})
export class MemberDetailComponent {
  @ViewChild('memberTabs') memberTabs?: TabsetComponent;
  member: Member | undefined;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];

  constructor(private memberService: MembersService, private route: ActivatedRoute,
    private messageService: MessageService){}

  ngOnInit(): void{
    this.loadMember();
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages'){
      this.loadMessages();
    }
  }

  loadMessages(){
    if(this.member){
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
      });
    }
  }

  loadMember(){
    const username = this.route.snapshot.paramMap.get(APP_ROUTES.ROUTE_MEMBER_DETAIL_PARAM_USERNAME);
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member;
        this.getImages();
      }
    });
  }

  getImages(){
    if(!this.member) return;
    for(const photo of this.member.photos){
      this.images.push(new ImageItem({
        src: photo.url,
        thumb: photo.url
      }));
    }
  }
}
