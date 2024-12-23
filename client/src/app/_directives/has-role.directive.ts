import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';

@Directive({
    selector: '[appHasRole]',
    standalone: true
})
export class HasRoleDirective implements OnInit{
  private accountService = inject(AccountService);
  @Input() appHasRole: string[] = [];
  user = this.accountService.currentUser();

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>) {
  }
  ngOnInit(): void {
    if(this.user?.roles.some(r => this.appHasRole.includes(r))){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
    else{
      this.viewContainerRef.clear();
    }
  }

}
