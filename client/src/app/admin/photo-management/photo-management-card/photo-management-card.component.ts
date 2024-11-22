import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-management-card',
  templateUrl: './photo-management-card.component.html',
  styleUrls: ['./photo-management-card.component.css']
})
export class PhotoManagementCardComponent {
  @Input() photo: Photo | undefined;
  @Output() rejectApprovePhotoEvent = new EventEmitter<number>();

  constructor(private adminService: AdminService, private toastrService: ToastrService){}

  approvePhoto(){
    if(!this.photo) return;
    let photoId = this.photo.id;
    this.adminService.approvePhoto(photoId).subscribe({
      next: _ =>{
        this.toastrService.success('Photo approved');
        this.rejectApprovePhotoEvent.emit(photoId);
      }
    });
  }

  rejectPhoto(){
    if(!this.photo) return;
    let photoId = this.photo.id;
    this.adminService.rejectPhoto(photoId).subscribe({
      next: _ =>{
        this.toastrService.success('Photo rejected');
        this.rejectApprovePhotoEvent.emit(photoId);
      }
    });
  }
}
