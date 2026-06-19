import { Component, inject, OnInit, signal } from '@angular/core';
import { MessagesService } from '../../core/services/messages-service';
import { MembersService } from '../../core/services/members-service';
import { Message } from '../../types/message';

@Component({
  selector: 'app-member-messages',
  imports: [],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit{
  private messagesService = inject(MessagesService);
  private membersService = inject(MembersService);
  protected messages = signal<Message[]>([]);

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    const memberId = this.membersService.member()?.id;
    if (memberId) {
      this.messagesService.getMessageThread(memberId).subscribe({
        next: messages => this.messages.set(messages)
      })
    }
  }
}
