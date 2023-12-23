import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';

// Path constants
export const APP_ROUTES = {
  ROUTE_MEMBERS: 'members',
  ROUTE_MEMBER_DETAIL: 'members/:username',
  ROUTE_MEMBER_DETAIL_PARAM_USERNAME: 'username',
  ROUTE_LISTS: 'lists',
  ROUTE_MESSAGES: 'messages'
};

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children:[
      {path: APP_ROUTES.ROUTE_MEMBERS, component: MemberListComponent},
      {path: APP_ROUTES.ROUTE_MEMBER_DETAIL, component: MemberDetailComponent},
      {path: APP_ROUTES.ROUTE_LISTS, component: ListsComponent},
      {path: APP_ROUTES.ROUTE_MESSAGES, component: MessagesComponent}
    ]
  },
  {path: 'errors', component: TestErrorComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
