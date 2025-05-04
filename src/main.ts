import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/authentication/login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // ✅ Importa LoginComponent

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [...(appConfig.providers || []), LoginComponent, provideAnimationsAsync()], // ✅ Agrega LoginComponent aquí
}).catch((err) => console.error(err));
