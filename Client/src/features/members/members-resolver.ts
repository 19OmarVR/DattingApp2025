import { inject } from '@angular/core/primitives/di';
import { ResolveFn, Router } from '@angular/router';
import { MembersService } from '../../core/services/members-service';
import { Member } from '../../types/member';
import { EMPTY } from 'rxjs';

export const membersResolver: ResolveFn<Member> = (route, state) => {
  const membersService = inject(MembersService);
  const memberId = route.paramMap.get('id');
  const router = inject(Router);

  if (memberId) {
    return membersService.getMember(memberId);
  }

  router.navigateByUrl("/not-found");
  return EMPTY;
};
