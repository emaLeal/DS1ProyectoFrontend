import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/authentication/login/login.component'; // ✅ Importa LoginComponent

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [...(appConfig.providers || []), LoginComponent], // ✅ Agrega LoginComponent aquí
}).catch((err) => console.error(err));
