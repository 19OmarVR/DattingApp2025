import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MemberList } from '../features/members/member-list/member-list';
import { MemberDetail } from '../features/members/member-detail/member-detail';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';

export const routes: Routes = [
  { path: "", component: Home },
  { path: "members", component: MemberList },
  { path: "members/{id}", component: MemberDetail },
  { path: "lists", component: Lists },
  { path: "messages", component: Messages },
  { path: "**", component: Home }
];
