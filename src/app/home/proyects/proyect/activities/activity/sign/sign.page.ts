import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { Activity } from 'src/app/interfaces/activity.interface';
import { Firma } from 'src/app/interfaces/firma.interface';
import { Proyect } from 'src/app/interfaces/proyect.interface';
import { USER } from 'src/app/interfaces/user.interface';
import { ActivityService } from 'src/app/services/activity.service';
import { SignatureService } from 'src/app/services/signature.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.page.html',
  styleUrls: ['./sign.page.scss'],
})
export class SignPage implements OnInit {
  @ViewChild('signatureCanvas') signaturePadElement!: ElementRef;
  signaturePad: any;
  imagen: string = '';
  activity: Activity | null = null;
  backRoute: string = '';
  isAlertOpen: boolean = false;
  user: USER | null = this.userService.getUser();
  firmaData: Firma | null = null;
  project: Proyect | null = null;
  firstPhotoUrls: { [idTarea: string]: string } = {};

  alertOptions = {
    header: 'Actividad completada',
    message:
      'La actividad ha sido completada con éxito. Muchas gracias por tu confianza.',
    buttons: ['Continuar'],
  };

  constructor(
    private userService: UserService,
    private signService: SignatureService,
    private activityService: ActivityService
  ) { }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(
      this.signaturePadElement.nativeElement
    );
  }
  ngOnInit() {
    this.activity = this.activityService.getCurrentActivity()
     if (this.activity?.idTarea) {
       this.getPhotos(this.activity.idTarea);
     }
    this.checkProjectSignature();
  }

  checkProjectSignature() {
    if (this.activity) {
      this.signService.getSignature(this.activity.idTarea)
        .subscribe(
          (res: any) => {
            if (res) {
              this.firmaData = res; 
            } else {
              this.getFirma();
            }
          },
          (err) => {
            console.error('Error al recuperar la firma del proyecto:', err);
          }
        );
    }
  }

  clear() {
    this.signaturePad.clear();
  }

  setOpen(option: boolean) {
    this.isAlertOpen = option;
  }

  save() {
    const data = this.signaturePad.toDataURL('image/png');
    this.signService
      .postSignatureA(
        this.activity?.idProyecto || '',
        this.activity?.idTarea || '',
        data
      )
      .subscribe(
        (res) => {
          this.setOpen(true);
          this.getFirma();
        },
        (err) => {
          console.error(err);
        }
      );
  }

  getFirma() {
    this.signService
      .getSignature(this.activity?.idProyecto || '', this.activity?.idTarea)
      .subscribe(
        (res: any) => {
          this.firmaData = res;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  getPhotos(idTarea: string) {
    this.activityService.getPhotos(idTarea)
      .subscribe(
        photos => {
          if (photos && photos.length > 0) {
            this.firstPhotoUrls[idTarea] = photos[0].urlImagen;
          } else {
            this.firstPhotoUrls[idTarea] = '';
          }
        },
        error => {
          console.error('Error al obtener fotos:', error);
          this.firstPhotoUrls[idTarea] = '';
        }
      );
  }
}
