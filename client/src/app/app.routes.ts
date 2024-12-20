import { Routes } from "@angular/router";
import { adminGuard } from "./_guard/admin.guard";
import { authGuard } from "./_guards/auth.guard";
import { preventUnsavedChangesGuard } from "./_guards/prevent-unsaved-changes.guard";
import { memberDetailedResolver } from "./_resolvers/member-detailed.resolver";
import { AdminPanelComponent } from "./admin/admin-panel/admin-panel.component";
import { NotFoundComponent } from "./errors/not-found/not-found.component";
import { RngComponent } from "./errors/rng/rng.component";
import { ServerErrorComponent } from "./errors/server-error/server-error.component";
import { TestErrorComponent } from "./errors/test-error/test-error.component";
import { HomeComponent } from "./home/home.component";
import { ListsComponent } from "./lists/lists.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { MessagesComponent } from "./messages/messages.component";

// Path constants
export const APP_ROUTES = {
  ROUTE_MEMBERS: 'members',
  ROUTE_MEMBER_DETAIL: 'members/:username',
  ROUTE_MEMBER_EDIT: 'member/edit',
  ROUTE_MEMBER_DETAIL_PARAM_USERNAME: 'username',
  ROUTE_LISTS: 'lists',
  ROUTE_MESSAGES: 'messages',
  ROUTE_ADMIN: 'admin'
};

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children:[
      {path: APP_ROUTES.ROUTE_MEMBERS, component: MemberListComponent},
      {path: APP_ROUTES.ROUTE_MEMBER_DETAIL, component: MemberDetailComponent, resolve: {member: memberDetailedResolver}},
      {path: APP_ROUTES.ROUTE_MEMBER_EDIT, component: MemberEditComponent, canDeactivate: [preventUnsavedChangesGuard]},
      {path: APP_ROUTES.ROUTE_LISTS, component: ListsComponent},
      {path: APP_ROUTES.ROUTE_MESSAGES, component: MessagesComponent},
      {path: APP_ROUTES.ROUTE_ADMIN, component: AdminPanelComponent, canActivate: [adminGuard]}
    ]
  },
  {path: 'errors', component: TestErrorComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: 'rng', component: RngComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'}
];