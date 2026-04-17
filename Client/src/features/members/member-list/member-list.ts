import { Component, inject, OnInit, signal } from '@angular/core';
import { MembersService } from '../../../core/services/members-service';
import { Member } from '../../../types/member';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from "../member-card/member-card";
import { PaginationResult } from '../../../types/paginationMetadata';
import { Paginator } from "../../../shared/paginator/paginator";

@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe, MemberCard, Paginator],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  private membersService = inject(MembersService);
  protected paginatedMembers = signal<PaginationResult<Member> | null>(null);
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.membersService.getMembers(this.pageNumber, this.pageSize).subscribe({
      next: result => {
        this.paginatedMembers.set(result);
      }
    })
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadMembers();
  }
}
