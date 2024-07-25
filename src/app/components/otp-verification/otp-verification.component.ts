import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-otp-verification-component',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
})
export class OtpVerificationComponent  implements OnInit {
  @Input()
  confirmCodeFunction!: ((code: string) => Observable<any>);
  @Input() successHeader: string = 'Codigo Valido';
  @Input() errorHeader: string = 'Codigo Invalido';
  @Input() successMessage: string = 'El código de confirmación es correcto, ya puede iniciar sesión en la plataforma.';
  @Input() errorMessage: string = 'Por favor, verifique que el código coincida con el código enviado a su correo electrónico.';
  @Input()
  successHandler!: (() => void);
  isAlertOpen = false;
  alertOptions = {
    header: 'Error en la autenticación del código.',
    message: '',
    buttons: [{ text: 'Reintentar', handler: () => { 
     this.setOpen(false); 
    } }],
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  nextInput(event: any) {
    let id = event.target.id.split('-')[1];
    if (id === '1' && event.code === 'Backspace') {
      return;
    } else if (event.code === 'Backspace' && id !== '1') {
      let prevId = parseInt(id) - 1;
      let prevInput = document.getElementById(
        'number-' + prevId
      ) as HTMLInputElement;
      prevInput.focus();
      prevInput.select();
      return;
    } else {
      let nextId = parseInt(id) + 1;
      let nextInput = document.getElementById(
        'number-' + nextId
      ) as HTMLInputElement;
      nextInput?.focus();
      nextInput?.select();
    }

    if (id === '4') {
      return;
    }
  }

  fillCode(event: any) {
    const input = event.target;

    let code = input.value;

    if (code.length === 4) {
      for (let i = 1; i <= 4; i++) {
        let inputFor = document.getElementById(
          'number-' + i
        ) as HTMLInputElement;
        inputFor.value = code[i - 1];
      }
    }
  }

  confirmCodeEntered() {
    let code = '';
    for (let i = 1; i <= 4; i++) {
      let inputFor = document.getElementById('number-' + i) as HTMLInputElement;
      code += inputFor.value;
    }
    this.confirmCodeFunction(code).subscribe(
      (data: any) => {
        this.alertOptions.header = this.successHeader;
        this.alertOptions.message = this.successMessage;
        this.alertOptions.buttons = [
          {
            text: 'OK',
            handler: () => {
              this.successHandler();
            }
          }
        ];
        this.authService.setFalseVerificationCode();
        this.setOpen(true);
      },
      (error: any) => {
        console.error(error);
        this.alertOptions.header = this.errorHeader;
        this.alertOptions.message = this.errorMessage;
        
        this.setOpen(true);
      }
    );
  }

}
