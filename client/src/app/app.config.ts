import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, RouteReuseStrategy } from "@angular/router";
import { provideToastr } from "ngx-toastr";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";
import { JwtInterceptor } from "./_interceptors/jwt.interceptor";
import { LoadingInterceptor } from "./_interceptors/loading.interceptor";
import { SharedModule } from "./_modules/shared.module";
import { CustomRouteReuseStrategy } from "./_services/customRouteReuseStrategy";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
    providers: [
            provideRouter(routes),
            provideToastr({
                positionClass: 'toast-bottom-right'
            }),
            importProvidersFrom(BrowserModule, FormsModule, ReactiveFormsModule, SharedModule),
            { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
            { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
            { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
            { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
            provideHttpClient(withInterceptorsFromDi()),
            provideAnimations()
        ]
}