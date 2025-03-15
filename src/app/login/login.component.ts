import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from './auth.service';

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
export class LoginComponent {
  translate: TranslateService = inject(TranslateService);
  translateText(lang: string) {
    this.translate.use(lang);
  }
  form: any;
  auth: boolean = false

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {}

  // validatePassword() {
  //   const patron = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     if (control.value && !patron.test(control.value)) {
  //       return { requisitosNoCumplidos: true }; // El error que se devolverá si no cumple
  //     }
  //     return null; // Si cumple con el patrón, no hay error
  //   };
  // }

  ngOnInit() {
    this.form = this.formBuilder.group({
      document_id: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  submit() {
    const {document_id, password} = this.form.value
    this.authService.login(document_id, password)
    this.auth = true
  }
}
