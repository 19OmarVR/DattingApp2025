import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../features/member-profile/member-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {
  if (component.memberProfileEditForm?.dirty) {
    return confirm('You have unsave changes, do you want to leave?')
  }

  return true;
};
