import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationResult } from '../../types/paginationMetadata';
import { Message } from '../../types/message';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { AccountService } from './account-service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private baseUrl = environment.apiUrl;
  private hubUrl = environment.hubUrl;
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private hubConnection?: HubConnection;
  messageThread = signal<Message[]>([]);

  createHubConnection(otherUserId: string) {
    const user = this.accountService.currentUser();
    if (!user) return;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?userId=' + otherUserId, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('ReceivedMessageThread', (messages: Message[]) => {
      this.messageThread.set(messages.map(m => ({
        ...m,
        currentUserSender: m.senderId === user.id
      })));
    });

    this.hubConnection.on('NewMessage', (message: Message) => {
      this.messageThread.update(messages => [
        ...messages,
        { ...message, currentUserSender: message.senderId === user.id }
      ]);
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(error => console.log(error));
      this.messageThread.set([]);
    }
  }

  sendMessage(recipientId: string, content: string) {
    return this.hubConnection?.invoke('SendMessage', { recipientId, content });
  }

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('container', container);
    return this.http.get<PaginationResult<Message>>(this.baseUrl + 'messages', { params });
  }

  deleteMessage(id: string) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
