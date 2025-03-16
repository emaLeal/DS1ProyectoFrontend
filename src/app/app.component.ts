import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginComponent } from "./login/login.component";
import { RouterModule } from '@angular/router';
import TranslateLogic from './translate/translate.class';

@Component({
  selector: 'app-root',
  imports: [TranslateModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent extends TranslateLogic {
  constructor(translate: TranslateService) {
    super(translate)
  }
}
