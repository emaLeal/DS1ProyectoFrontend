import { Component, inject, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
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
import { Login } from '../auth.types';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends TranslateLogic implements AfterViewInit {
  form?: FormGroup | undefined;
  onCaptchaPassed: boolean = false;
  captchaToken?: string;
  showPassword = false;
  loginError: string = '';
  isLoading: boolean = true;
  isLoggingIn: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private zone: NgZone,
    translate: TranslateService,
    private httpClient: HttpClient,
    private router: Router
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
    
    // Simular tiempo de carga inicial
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
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
      this.loginError = '';
      this.isLoggingIn = true;

      this.authService.login(login).subscribe({
        next: (value: any) => {
          const token = value;
          const JSONToken = JSON.stringify(value);
          localStorage.setItem('token', JSONToken);
          localStorage.setItem('captcha-token', this.captchaToken!);
          
          let urlProfile: string = environment.baseUrl + environment.authentication.profile;
          
          this.httpClient.get(urlProfile, { 
            headers: { 'authorization': `Bearer ${token.access}` } 
          }).subscribe({
            next: (user) => {
              localStorage.setItem('user_data', JSON.stringify(user));
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              this.isLoggingIn = false;
              this.loginError = '¡Error al obtener el perfil de usuario!';
              console.error('Error al obtener perfil:', error);
            }
          });
        },
        error: (error) => {
          this.isLoggingIn = false;
          this.loginError = '¡Fallo al iniciar sesión! Por favor verifica tu documento de identidad y contraseña';
          console.error('Error de login:', error);
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
