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
import { environment } from '../../../../public/environment';

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
  public override translate: TranslateService;
  form?: FormGroup | undefined;
  recoveryForm?: FormGroup | undefined;
  onCaptchaPassed: boolean = false;
  captchaToken?: string;
  showPassword = false;
  loginError: string = '';
  recoveryError: string = '';
  recoverySuccess: string = '';
  isLoading: boolean = true;
  isLoggingIn: boolean = false;
  isRecoveringPassword: boolean = false;
  isTestMode: boolean = false;
  showRecoveryForm: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private zone: NgZone,
    translate: TranslateService,
    private httpClient: HttpClient,
    private router: Router
  ) {
    super(translate);
    this.translate = translate;
  }

  ngOnInit() {
    // Detectar modo test por localStorage
    this.isTestMode = localStorage.getItem('PLAYWRIGHT_TEST') === 'true';
    if (this.isTestMode) {
      this.onCaptchaPassed = true;
      this.captchaToken = 'test-token';
    }
    // Enlazar el callback global para reCAPTCHA
    (window as any).onCaptchaResolved = this.onCaptchaResolved.bind(this);
    this.form = this.formBuilder.group({
      document_id: ['', Validators.required],
      password: [
        '',
        [Validators.required,],
      ],
    });

    this.recoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    // Simular tiempo de carga inicial
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  ngAfterViewInit() {
    // Solo renderizar el captcha si NO estamos en test
    if (!this.isTestMode) {
      if ((window as any).grecaptcha) {
        (window as any).grecaptcha.render('recaptcha-container', {
          sitekey: '6Lcanv0qAAAAAJZXEdthr0g_wb1wMR6lYSEjOFro',
        });
      }
    }
  }

  onCaptchaResolved(token: string) {
    this.onCaptchaPassed = true;
    this.captchaToken = token;
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
        next: (response: any) => {
          // Guardar los tokens
          localStorage.setItem('token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('captcha-token', this.captchaToken!);
          
          let urlProfile: string = environment.baseUrl + environment.authentication.profile;
          
          this.httpClient.get(urlProfile, { 
            headers: { 'authorization': `Bearer ${response.access}` } 
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

  showPasswordRecovery(): void {
    this.showRecoveryForm = true;
    this.loginError = '';
    this.recoveryError = '';
    this.recoverySuccess = '';
  }

  backToLogin(): void {
    this.showRecoveryForm = false;
    this.recoveryError = '';
    this.recoverySuccess = '';
  }

  submitRecovery(): void {
    if (this.recoveryForm?.valid) {
      const email = this.recoveryForm.value.email;
      this.isRecoveringPassword = true;
      this.recoveryError = '';
      this.recoverySuccess = '';

      this.authService.passwordRecovery(email).subscribe({
        next: (response: any) => {
          this.isRecoveringPassword = false;
          this.recoverySuccess = this.translate.instant('password_recovery.success_message');
          this.recoveryForm?.reset();
        },
        error: (error) => {
          this.isRecoveringPassword = false;
          this.recoveryError = this.translate.instant('password_recovery.error_message');
          console.error('Error en recuperación de contraseña:', error);
        }
      });
    }
  }
}
