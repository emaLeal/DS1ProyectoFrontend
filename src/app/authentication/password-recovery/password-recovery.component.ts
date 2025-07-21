import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent {
  recoveryForm: FormGroup;
  recoveryError: string = '';
  recoverySuccess: string = '';
  isRecoveringPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.recoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
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

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
