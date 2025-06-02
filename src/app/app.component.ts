import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import TranslateLogic from './lib/translate/translate.class';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, FormsModule, TranslateModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends TranslateLogic implements OnInit {
  title = 'frontend';
  menuOpen = false;

  constructor(
    translate: TranslateService,
    private router: Router
  ) {
    super(translate);
    // Establecer el idioma por defecto
    this.translate?.setDefaultLang('es');
    // Usar el idioma preferido del usuario o el español por defecto
    this.translate?.use(this.preferedLanguage);
  }

  ngOnInit() {
    // La inicialización ya se hizo en el constructor
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  isAuthRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/login') || currentUrl.includes('/register');
  }
}
