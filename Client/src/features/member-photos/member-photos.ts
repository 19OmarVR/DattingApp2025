import { Component, inject, OnInit, signal } from '@angular/core';
import { MembersService } from '../../core/services/members-service';
import { Member, Photo } from '../../types/member';
import { ActivatedRoute } from '@angular/router';
import { ImageUpload } from '../../shared/image-upload/image-upload';
import { AccountService } from '../../core/services/account-service';
import { User } from '../../types/user';
import { IconButton } from '../../shared/icon-button/icon-button';

@Component({
  selector: 'app-member-photos',
  imports: [ ImageUpload, IconButton ],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  protected membersService = inject(MembersService);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

   ngOnInit(): void {    const memberId = this.route.parent?.snapshot.paramMap.get("id");
    if (memberId) {
      this.membersService.getPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      });
    }
  }

  get photoMocks() {
    return Array.from({ length: 0 }, (_, i) => ({
      url: "./user.jpg"
    }));
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.membersService.uploadPhoto(file).subscribe({
      next: photo => {
        this.membersService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);
      },
      error: error => {
        console.log('Error while uploading the image: ', error);
        this.loading.set(false);
      }
    })
  }
  setMainPhoto(photo: Photo) {
    this.membersService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) currentUser.imageUrl = photo.url;
        this.accountService.setCurrentUser(currentUser as User);
        this.membersService.member.update(member => ({
          ...member,
          imageUrl: photo.url
        }) as Member);
      }
    });
  }
}
