import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { APP_ROUTES } from 'src/app/app-routing.module';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports: [CommonModule, TabsModule, GalleryModule]
})
export class MemberDetailComponent {
  member: Member | undefined;
  images: GalleryItem[] = [];

  constructor(private memberService: MembersService, private route: ActivatedRoute){}

  ngOnInit(): void{
    this.loadMember();
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
