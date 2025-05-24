import { CommonModule } from '@angular/common';
import { Component, inject, AfterViewInit, NgZone } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Router } from '@angular/router'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import TranslateLogic from '../../lib/translate/translate.class';
import { Login } from '../auth.types'

@Component({
  selector: 'app-login',
  imports: [
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent extends TranslateLogic implements AfterViewInit {
  form?: FormGroup | undefined;
  onCaptchaPassed: boolean = false;
  captchaToken?: string;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private zone: NgZone,
    translate: TranslateService,
  ) {
    super(translate);
  }



  ngOnInit() {
    this.form = this.formBuilder.group({
      document_id: ['', Validators.required],
      password: [
        '',
        [Validators.required,],
      ],
    });
    (window as any).onCaptchaResolved = this.onCaptchaResolved.bind(this);
  }

  ngAfterViewInit() {
    if ((window as any).grecaptcha) {
      (window as any).grecaptcha.render('recaptcha-container', {
        sitekey: '6Lcanv0qAAAAAJZXEdthr0g_wb1wMR6lYSEjOFro',
      });
    }
  }


  onCaptchaResolved(response: string) {
    if (response) {
      this.zone.run(() => {
        this.onCaptchaPassed = true;
        this.captchaToken = response;
      });
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  submit() {
    if (this.form?.valid && this.onCaptchaPassed) {
      const login: Login = this.form?.value;
      this.authService.login(login);
      localStorage.setItem('captcha-token', this.captchaToken!);
    }
  }
}
