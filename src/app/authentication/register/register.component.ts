import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, NgZone, ViewChild, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { RouterModule, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import TranslateLogic from '../../lib/translate/translate.class';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from '../auth.service';
import { firstValueFrom } from 'rxjs';

interface RegisterResponse {
  success: boolean;
  message: string;
  // Agrega aquí más campos según la respuesta real de tu API
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent extends TranslateLogic implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  form!: FormGroup;
  personalInfoForm!: FormGroup;
  contactInfoForm!: FormGroup;
  passwordForm!: FormGroup;
  
  isLinear = true;
  onCaptchaPassed = false;
  captchaToken?: string;
  showPassword = false;
  showConfirmPassword = false;
  isTestMode: boolean = false;

  requisitos = {
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  };

  documentTypes = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
  ];

  genderTypes = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'O', label: 'Otro' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private zone: NgZone,
    translate: TranslateService,
    private router: Router
  ) {
    super(translate);
  }

  ngOnInit() {
    this.initForm();
    (window as any).onCaptchaResolved = this.onCaptchaResolved.bind(this);
    
    // Detectar modo test por localStorage
    this.isTestMode = localStorage.getItem('PLAYWRIGHT_TEST') === 'true';
    if (this.isTestMode) {
      this.onCaptchaPassed = true;
      this.captchaToken = 'test-token';
    }

  }

  private initForm(): void {
    // Formulario de información personal
    this.personalInfoForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      identification_type: ['', [Validators.required]],
      document_id: ['', [Validators.required, Validators.pattern('^[0-9]{6,12}$')]],
      birth_date: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    });

    // Suscribirse a los cambios de cada control del personalInfoForm
    Object.keys(this.personalInfoForm.controls).forEach(key => {
      const control = this.personalInfoForm.get(key);
      control?.valueChanges.subscribe(() => {
        control.markAsTouched();
        control.markAsDirty();
        this.personalInfoForm.markAsTouched();
        this.personalInfoForm.markAsDirty();
        this.checkFormValidity();
      });
    });

    // Formulario de información de contacto
    this.contactInfoForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      cell_phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      address: ['', [Validators.required, Validators.minLength(5)]]
    });

    // Suscribirse a los cambios de cada control del contactInfoForm
    Object.keys(this.contactInfoForm.controls).forEach(key => {
      const control = this.contactInfoForm.get(key);
      control?.valueChanges.subscribe(() => {
        control.markAsTouched();
        control.markAsDirty();
        this.contactInfoForm.markAsTouched();
        this.contactInfoForm.markAsDirty();
        this.checkContactFormValidity();
      });
    });

    // Formulario de contraseña
    this.passwordForm = this.formBuilder.group({
      password: ['', [
        Validators.required,
        this.validatePassword()
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordsMatchValidator.bind(this),
      updateOn: 'change'
    });

    // Suscribirse a los cambios de cada control del passwordForm
    Object.keys(this.passwordForm.controls).forEach(key => {
      const control = this.passwordForm.get(key);
      control?.valueChanges.subscribe(() => {
        control.markAsTouched();
        control.markAsDirty();
        this.passwordForm.markAsTouched();
        this.passwordForm.markAsDirty();
        this.passwordForm.updateValueAndValidity();
        this.checkPasswordFormValidity();
      });
    });

    // Formulario principal que combina todos los grupos
    this.form = this.formBuilder.group({
      ...this.personalInfoForm.controls,
      ...this.contactInfoForm.controls,
      password: this.passwordForm.get('password')?.value
    });
  }

  checkFormValidity(): void {
    const allValid = Object.keys(this.personalInfoForm.controls).every(key => {
      const control = this.personalInfoForm.get(key);
      return control?.valid;
    });

    if (allValid) {
      this.personalInfoForm.setErrors(null);
    }

    console.log('Estado del formulario:', {
      valid: this.personalInfoForm.valid,
      touched: this.personalInfoForm.touched,
      dirty: this.personalInfoForm.dirty,
      pristine: this.personalInfoForm.pristine,
      controls: Object.keys(this.personalInfoForm.controls).map(key => ({
        field: key,
        value: this.personalInfoForm.get(key)?.value,
        valid: this.personalInfoForm.get(key)?.valid,
        touched: this.personalInfoForm.get(key)?.touched,
        dirty: this.personalInfoForm.get(key)?.dirty
      }))
    });
  }

  nextStep(): void {
    this.personalInfoForm.markAllAsTouched();
    this.personalInfoForm.markAsDirty();
    this.checkFormValidity();

    if (this.personalInfoForm.valid) {
      this.stepper.next();
    }
  }

  previousStep(): void {
    this.stepper.previous();
  }

  onPasswordInput(): void {
    const password = this.passwordForm.get('password')?.value || '';
    
    // Actualizar el estado de los requisitos
    this.requisitos = {
      length: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Forzar la validación del formulario
    this.passwordForm.get('password')?.updateValueAndValidity();
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

  ngAfterViewInit(): void {
    // Intentar cargar el captcha después de un breve retraso para asegurar que el DOM esté listo
    setTimeout(() => {
      this.loadCaptcha();
    }, 1000);
  }

  private loadCaptcha(): void {
    // Verificar si el contenedor del captcha existe
    const captchaContainer = document.getElementById('recaptcha-container');
    if (!captchaContainer) {
      console.error('Contenedor del captcha no encontrado');
      return;
    }

    // Verificar si grecaptcha está disponible
    if (!(window as any).grecaptcha) {
      console.error('grecaptcha no está disponible');
      // Intentar recargar el script de reCAPTCHA
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Intentar renderizar el captcha después de cargar el script
        setTimeout(() => {
          this.renderCaptcha();
        }, 500);
      };
      document.head.appendChild(script);
      return;
    }

    this.renderCaptcha();
  }

  private renderCaptcha(): void {
    if ((window as any).grecaptcha) {
      try {
        (window as any).grecaptcha.render('recaptcha-container', {
          sitekey: '6Lcanv0qAAAAAJZXEdthr0g_wb1wMR6lYSEjOFro',
          callback: (response: string) => {
            this.zone.run(() => {
              this.onCaptchaPassed = true;
              this.captchaToken = response;
            });
          }
        });
      } catch (error) {
        console.error('Error al renderizar el captcha:', error);
      }
    }
  }

  onCaptchaResolved(response: string): void {
    this.zone.run(() => {
      this.onCaptchaPassed = true;
      this.captchaToken = response;
    });
  }

  onlyLetters(event: KeyboardEvent): void {
    const pattern = /[a-zA-Z\s]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  debugFormState(): void {
    console.log('Estado del formulario:', {
      formValid: this.personalInfoForm.valid,
      formStatus: this.personalInfoForm.status,
      formErrors: this.personalInfoForm.errors,
      formValues: this.personalInfoForm.value,
      formControls: Object.keys(this.personalInfoForm.controls).map(key => ({
        name: key,
        valid: this.personalInfoForm.get(key)?.valid,
        errors: this.personalInfoForm.get(key)?.errors,
        value: this.personalInfoForm.get(key)?.value
      }))
    });
  }

  isFirstStepValid(): boolean {
    const allFieldsValid = Object.keys(this.personalInfoForm.controls).every(key => {
      const control = this.personalInfoForm.get(key);
      return control && control.valid;
    });

    if (allFieldsValid) {
      console.log('Primer paso válido, campos:', this.personalInfoForm.value);
    }

    return allFieldsValid;
  }

  checkContactFormValidity(): void {
    const allValid = Object.keys(this.contactInfoForm.controls).every(key => {
      const control = this.contactInfoForm.get(key);
      return control?.valid;
    });

    if (allValid) {
      this.contactInfoForm.setErrors(null);
    }

    console.log('Estado del formulario de contacto:', {
      valid: this.contactInfoForm.valid,
      touched: this.contactInfoForm.touched,
      dirty: this.contactInfoForm.dirty,
      pristine: this.contactInfoForm.pristine,
      controls: Object.keys(this.contactInfoForm.controls).map(key => ({
        field: key,
        value: this.contactInfoForm.get(key)?.value,
        valid: this.contactInfoForm.get(key)?.valid,
        touched: this.contactInfoForm.get(key)?.touched,
        dirty: this.contactInfoForm.get(key)?.dirty
      }))
    });
  }

  checkPasswordFormValidity(): void {
    const allValid = Object.keys(this.passwordForm.controls).every(key => {
      const control = this.passwordForm.get(key);
      return control?.valid;
    });

    if (allValid && !this.passwordForm.hasError('passwordMismatch')) {
      this.passwordForm.setErrors(null);
    }

    console.log('Estado del formulario de contraseña:', {
      valid: this.passwordForm.valid,
      touched: this.passwordForm.touched,
      dirty: this.passwordForm.dirty,
      pristine: this.passwordForm.pristine,
      controls: Object.keys(this.passwordForm.controls).map(key => ({
        field: key,
        value: this.passwordForm.get(key)?.value,
        valid: this.passwordForm.get(key)?.valid,
        touched: this.passwordForm.get(key)?.touched,
        dirty: this.passwordForm.get(key)?.dirty
      }))
    });
  }

  async submit(): Promise<void> {
    // Marcar todos los formularios como tocados para mostrar errores si los hay
    this.personalInfoForm.markAllAsTouched();
    this.contactInfoForm.markAllAsTouched();
    this.passwordForm.markAllAsTouched();

    // Verificar la validez de todos los formularios
    this.checkFormValidity();
    this.checkContactFormValidity();
    this.checkPasswordFormValidity();

    if (this.form.valid && this.onCaptchaPassed) {
      const formData = {
        ...this.form.value
      };
      delete formData.confirmPassword;
      
      try {
        //Error se esta enviando la contraseña vacia!!!
        //Solucion temporal actualizar la contraseña aqui
        formData.password = this.passwordForm.get('password')?.value
        //----------------//
        console.log('Enviando datos del formulario:', formData);
        const response = await firstValueFrom(this.authService.register(formData));
        console.log('Registro exitoso:', response);
        alert("Te has registrado correctamente");
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error en el registro:', error);
        alert(error);
      }
    } else {
      console.log('Formulario inválido o captcha no completado:', {
        formValid: this.form.valid,
        personalInfoValid: this.personalInfoForm.valid,
        contactInfoValid: this.contactInfoForm.valid,
        passwordValid: this.passwordForm.valid,
        captchaPassed: this.onCaptchaPassed
      });
    }
  }
}
