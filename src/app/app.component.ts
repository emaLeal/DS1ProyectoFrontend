import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import TranslateLogic from './lib/translate/translate.class';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranslateModule, RouterModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent extends TranslateLogic {
  menuOpen = false;
  constructor(translate: TranslateService) {
    super(translate)
  }
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
