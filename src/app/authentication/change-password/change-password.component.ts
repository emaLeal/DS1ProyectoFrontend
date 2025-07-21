import { Component, inject, AfterViewInit, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  imports: [TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent extends TranslateLogic implements OnInit {
  form?: FormGroup | undefined;
  showPassword = false;
  loginError: string = '';
  isLoading: boolean = true;
  isTestMode: boolean = false;
  menuOpen: boolean = false;
  requisitos = {
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  };
  private snackBar = inject(MatSnackBar);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(translate);
  }

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');

    this.form = this.formBuilder.group({
      password: ['', [
        Validators.required,
        this.validatePassword()
      ]],
      confirmPassword: ['', [Validators.required]],
      token: [token]
    }, {
      validators: this.passwordsMatchValidator.bind(this),
      updateOn: 'change'
    });
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

    Object.keys(this.form?.controls).forEach(key => {
      const control = this.form?.get(key);
      control?.valueChanges.subscribe(() => {
        control.markAsTouched();
        control.markAsDirty();
        this.form?.markAsTouched();
        this.form?.markAsDirty();
        this.form?.updateValueAndValidity();
        this.checkPasswordFormValidity();
      });
    });
  }

  submit() {
    if (this.form?.valid) {
      console.log(this.form.value)
      this.authService.confirmResetPassword(this.form).subscribe((result: any) => {
        if (result.status !== "OK") {
          console.log(result)
          return
        }
        this.snackBar.open(this.translate?.instant('change_password.change_password_success'), 'X', { duration: 2000 })
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      })
    } else {
      console.log(this.form?.errors)

    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  passwordsMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
      return null;
    }
  }

  validatePassword() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';

      const requisitos = {
        length: value.length >= 8,
        hasUpper: /[A-Z]/.test(value),
        hasLower: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      };

      const isValid = requisitos.length &&
        requisitos.hasUpper &&
        requisitos.hasLower &&
        requisitos.hasNumber &&
        requisitos.hasSpecial;

      if (!isValid) {
        return { requisitosNoCumplidos: true };
      }

      return null;
    };
  }

  onPasswordInput(): void {
    const password = this.form?.get('password')?.value || '';

    // Actualizar el estado de los requisitos
    this.requisitos = {
      length: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Forzar la validación del formulario
    this.form?.get('password')?.updateValueAndValidity();
  }

  checkPasswordFormValidity(): void {
    const allValid = Object.keys(this.form!.controls).every(key => {
      const control = this.form?.get(key);
      return control?.valid;
    });

    if (allValid && !this.form?.hasError('passwordMismatch')) {
      this.form?.setErrors(null);
    }

  }

}
