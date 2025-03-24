import { CommonModule } from '@angular/common';
import { Component, inject, AfterViewInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import TranslateLogic from '../../translate/translate.class';

@Component({
  selector: 'app-login',
  imports: [
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent extends TranslateLogic implements AfterViewInit {
  form?: FormGroup | undefined;
  onCaptchaPassed: boolean = false;
  captchaToken?: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    translate: TranslateService
  ) {
    super(translate);
  }

  validatePassword() {
    const patron = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && !patron.test(control.value)) {
        return { requisitosNoCumplidos: true }; // El error que se devolverá si no cumple
      }
      return null; // Si cumple con el patrón, no hay error
    };
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      document_id: ['', Validators.required],
      password: [
        '',
        [Validators.required, this.validatePassword(), Validators.minLength(8)],
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
    this.onCaptchaPassed = true;
    this.captchaToken = response;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  submit() {
    const { document_id, password } = this.form?.value;
    this.authService.login(document_id, password);
    localStorage.setItem('captcha-token', this.captchaToken!);
  }
}
