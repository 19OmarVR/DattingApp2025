import { Component, inject, OnInit, signal } from '@angular/core';
import { MembersService } from '../../../core/services/members-service';
import { Member, MemberParams } from '../../../types/member';


import { MemberCard } from "../member-card/member-card";
import { PaginationResult } from '../../../types/paginationMetadata';
import { Paginator } from "../../../shared/paginator/paginator";

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  private membersService = inject(MembersService);
  protected paginatedMembers = signal<PaginationResult<Member> | null>(null);
  protected memberParams = new MemberParams();


  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.membersService.getMembers(this.memberParams).subscribe({
      next: result => {
        this.paginatedMembers.set(result);
      }
    })
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.memberParams.pageNumber = event.pageNumber;
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers();
  }
}
