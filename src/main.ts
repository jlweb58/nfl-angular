import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from './environments/environment';
import {enableProdMode} from '@angular/core';
import {LoginComponent} from './app/user/login/login.component';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import {provideHttpClient} from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(LoginComponent, {
  providers: [provideRouter(routes), provideHttpClient(), provideAnimations()],
}).catch(err => console.error(err));
