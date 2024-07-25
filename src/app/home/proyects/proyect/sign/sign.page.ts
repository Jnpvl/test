
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import SignaturePad from 'signature_pad';
import { Firma } from 'src/app/interfaces/firma.interface';
import { Proyect } from 'src/app/interfaces/proyect.interface';
import { USER } from 'src/app/interfaces/user.interface';
import { ProjectService } from 'src/app/services/project.service';
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
  isAlertOpen: boolean = false;
  user: USER | null = this.userService.getUser();
  firmaData: any;
  project: Proyect | null = null;
  activityIds: string[] = [];
  firmas: any[] = [];

  firmaProject: any;

  alertOptions = {
    header: 'Actividad completada',
    message:
      'La actividad ha sido completada con éxito. Muchas gracias por tu confianza.',
    buttons: ['Continuar'],
  };

  constructor(
    private userService: UserService,
    private signService: SignatureService,
    private projectService: ProjectService,
    private router: Router,
  ) { }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(
      this.signaturePadElement.nativeElement
    );
  }

  ngOnInit() {
    this.projectService.currentProject$.subscribe(project => {
      this.project = project;
    });
    this.getFirma();
  }

  clear() {
    this.signaturePad.clear();
  }

  setOpen(option: boolean) {
    this.isAlertOpen = option;
  }

  save() {
    const data = this.signaturePad.toDataURL('image/png');
    if (this.project?.idProyecto) {
      this.signService.postSignatureP(this.project.idProyecto, data)
        .subscribe(
          res => {
            this.setOpen(true);
            this.getFirma();
          },
          err => {
            console.error('Error al guardar la firma:', err);
          }
        );
    } else {
      console.error('ID de proyecto no disponible.');
    }
  }

  getFirma() {
    if (this.project?.idProyecto) {
      this.signService.getAllSignatureByProject(this.project.idProyecto)
        .subscribe({
          next: (res: any) => {
            if (Array.isArray(res.data)) {
              this.firmas = res.data as Firma[];
              this.firmaData = this.firmas.find(firma => !firma.isTaskLevel);
              this.firmaProject = this.firmaData;
              if (!this.firmaProject) {
                console.error('No se encontró ninguna firma con isTaskLevel false');
              }
            } else {
              console.error('La respuesta no es un arreglo:', res.data);
            }
          },
          error: (err) => {
            console.error('Error al recuperar las firmas:', err);
          }
        });
    } else {
      console.error('ID de proyecto no disponible.');
    }
  }

  back() {
    this.router.navigate(['../home/proyects', this.project, 'activities'], { replaceUrl: true })
  }
}
