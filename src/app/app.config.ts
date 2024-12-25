import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withDebugTracing} from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import {ErrorInterceptor} from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient( withInterceptorsFromDi(), ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideAnimations()]
};
