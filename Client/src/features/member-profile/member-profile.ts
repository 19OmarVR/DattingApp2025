import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../types/member';
import { DatePipe } from '@angular/common';
import { MembersService } from '../../core/services/members-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe,FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})

export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('memberProfileEditForm') memberProfileEditForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify ($event:BeforeUnloadEvent) {
    if (this.memberProfileEditForm?.dirty) {
      $event.preventDefault();
    }
  };
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  protected member = signal<Member | undefined>(undefined);
  protected membersService = inject(MembersService);
  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  };

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.member.set(data["member"]);
    });

    this.editableMember = {
      displayName: this.member()?.displayName || '',
      description: this.member()?.description || '',
      city: this.member()?.city || '',
      country: this.member()?.country || ''
    };
  }

  ngOnDestroy(): void {
    if (this.membersService.editMode()) {
      this.membersService.editMode.set(false);
    }
  }

  updateProfile() {
    if (!this.member()) return;
    const updatedMember = {...this.member(), ...this.editableMember};

    console.group("UPDATE");
    console.log(updatedMember);
    console.groupEnd();

    this.toast.success('Profile updated successfully');
    this.membersService.editMode.set(false);
  }
}
