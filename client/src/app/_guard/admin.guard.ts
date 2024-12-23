import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  if(accountService.currentRoles().includes('Admin') || accountService.currentRoles().includes('Moderator')){
    return true;
  }
  else{
    toastr.error('You can not enter this area');
    return false;
  }
};
