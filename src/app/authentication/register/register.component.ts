import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent extends TranslateLogic implements AfterViewInit {
  form?: FormGroup;
  onCaptchaPassed = false;
  captchaToken?: string;
  show: boolean = true;
  showPassword = false;
  showConfirmPassword = false;

  requisitos = {
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  };

  constructor(private fb: FormBuilder, private authService: AuthService, translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      idType: ['', Validators.required],
      id: ['', Validators.required],
      birth: ['', Validators.required],
      gender: ['', Validators.required],
      mobile: ['', Validators.required],
      password: ['', [Validators.required, this.validatePassword(), Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });

    (window as any).onCaptchaResolved = this.onCaptchaResolved.bind(this);
  }

  validatePassword() {
    const patron = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && !patron.test(control.value)) {
        return { requisitosNoCumplidos: true };
      }
      return null;
    };
  }

  /** valida cada punto de la contraseña para saber q cada cosa se cumple */
  onPasswordInput() {
    const value = this.form?.get('password')?.value || '';
    this.requisitos.length = value.length >= 8;
    this.requisitos.hasUpper = /[A-Z]/.test(value);
    this.requisitos.hasLower = /[a-z]/.test(value);
    this.requisitos.hasNumber = /\d/.test(value);
    this.requisitos.hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  }

  /**se supone q es para q la contraseña indique si es la misma o no al confirmarla (NO FUNCIONA :( ) */
  passwordsMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
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
    console.log(":D")
    if (this.form?.valid && this.onCaptchaPassed) {
      const { name, lastname, id, password, email, } = this.form.value;
      console.log('Datos de registro:', { name, lastname, password, email, id });
      localStorage.setItem('captcha-token', this.captchaToken!);
    }
  }

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  isLinear = false;
/**Solo permite letras y no numeros en los campos de solo letras  */
  onlyLetters(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode || event.which);
    const valid = /^[a-zA-ZÀ-ÿ\s]+$/.test(inputChar);
    if (!valid) {
      event.preventDefault();
    }
  }
/**Da la lista de opciones en el formulario */
  documentTypes = [
    { value: 'cedula', label: 'register.document_type.cedula' },
    { value: 'pasaporte', label: 'register.document_type.passport' },
    { value: 'dni', label: 'register.document_type.dni' },
  ];

  genderTypes = [
    { value: 'masculino', label: 'register.gender.m' },
    { value: 'femenino', label: 'register.gender.f' },
    { value: 'otro', label: 'register.gender.o' },
  ];
}
