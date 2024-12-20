import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_services/admin.service';
import { PhotoManagementCardComponent } from './photo-management-card/photo-management-card.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-photo-management',
    templateUrl: './photo-management.component.html',
    styleUrls: ['./photo-management.component.css'],
    standalone: true,
    imports: [NgFor, PhotoManagementCardComponent]
})
export class PhotoManagementComponent implements OnInit{
  photos: Photo[] = [];

  constructor(private adminService: AdminService, private toastrService: ToastrService){}

  ngOnInit(): void {
    this.getPhotosForApproval();
  }

  getPhotosForApproval(){
    this.adminService.getPhotosForApproval().subscribe({
      next: photos => {
        this.photos = photos;
      }
    })
  }

  rejectApprovePhoto(photoId: number){
   this.photos = this.photos.filter(p => p.id != photoId);
  }
}
