import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  isAlertOpen = false;
  disableButton = false;
  alert = {
    header: 'Error de registro',
    message: 'Por favor, llena todos los campos correctamente.',
    buttons: [{text: 'Reintentar', handler: () => {} }],
  };

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      if (password !== confirmPassword) {
        control.get('confirmPassword')?.setErrors({ passwordMatch: true });
        return { passwordMatch: true };
      } else {
        control.get('confirmPassword')?.setErrors(null);
        return null;
      }
    };
  }

  formulario = new FormGroup(
    {
      nombre: new FormControl('', Validators.required),
      apellidoP: new FormControl('', Validators.required),
      apellidoM: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      rfc: new FormControl(''),
      telefono: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: this.passwordMatchValidator() }
  );

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    return;
  }

  submit() {
    if (this.formulario.invalid) {
      return;
    }

    this.authService.register(this.formulario.value).subscribe(
      (data: any) => {
        this.authService.setVerificationCode();
        this.userService.setEmail(this.formulario.value.email!);
        this.alert.header = 'Código Enviado.';
        this.alert.message = 'Un código de verificación se ha generado para ' + this.formulario.value?.email + '.\n Por favor verifique su correo electrónico.';
        this.alert.buttons = [
          {
            text: 'OK',
            handler: () => {
              this.router.navigate(['/auth/otp-verification'], { queryParams: { type: 'register' } });
            }
          }
        ];
        this.setOpen(true);
      },
      (error: any) => {
        if (error.error.code === 101) {
          this.errorUserExists();
        }
      }
    );
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  errorUserExists() {
    this.alert.message = 'El correo ya está registrado en nuestra plataforma.';
    this.setOpen(true);
  }
}
