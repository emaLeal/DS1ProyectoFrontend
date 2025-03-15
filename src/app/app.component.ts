import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginComponent } from "./login/login.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [TranslateModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  translate: TranslateService = inject(TranslateService);
  translateText(lang: string) {
    this.translate.use(lang);
  }
}
