import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Activity } from 'src/app/interfaces/activity.interface';
import { Firma } from 'src/app/interfaces/firma.interface';
import { Proyect } from 'src/app/interfaces/proyect.interface';
import { ActivityService } from 'src/app/services/activity.service';
import { ProjectService } from 'src/app/services/project.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SignatureService } from 'src/app/services/signature.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  loading: boolean = false;
  loadingMessage: string = '';
  proyectId = '';
  allIdTareas: string[] = [];
  firstPhotoUrls: { [idTarea: string]: string } = {};
  activitiesList: Activity[] = [];
  firmaData: Firma | null = null;
  project: Proyect | null = null;

  firmaExistente: boolean = false;

  constructor(
    private activityService: ActivityService,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private signService: SignatureService,
    private reportsService: ReportsService,
    private alertController: AlertController
  ) { }

  ionViewWillEnter() {
    this.getActivities()
  }

  ngOnInit() {
    const currentProject: Proyect | null = this.projectService.getCurrentProject();
    if (currentProject) {
      this.proyectId = currentProject.idProyecto;
    } else {
      console.log('no hay proyecto actual')
    }
    this.getActivities();
  }

  getActivities() {
    this.loading = true;
    this.activityService.getActivities(this.proyectId)
      .subscribe(
        (activities) => {
          this.loading = false;
          this.activitiesList = activities;
          this.allIdTareas = activities.map(activity => activity.idTarea);
          this.allIdTareas.forEach(idTarea => {
            const activity = activities.find(activity => activity.idTarea ===idTarea)
            this.getPhotos(idTarea,activity);
          });
          this.loading = false;
          this.checkFirmas();
        },
        (error) => {
          this.loading = false;
          console.error('Error al obtener actividades:', error);
        }
      );
  }

  getPhotos(idTarea: string,activity: any) {
    this.activityService.getPhotos(idTarea)
      .subscribe(
        photos => {
          if (photos && photos.length > 0) {
            const firstPhoto = photos[0];
            const photoUrl = firstPhoto.urlImagen;
            if (photoUrl.toLowerCase().endsWith('.pdf')) {
              this.firstPhotoUrls[idTarea] = 'assets/images/otrowhite.png';
            } else if (firstPhoto.notas.trim() === 'Firma' && activity.actividad != 'Firma del proyecto') {
              this.firstPhotoUrls[idTarea] = '';
            } else {
              this.firstPhotoUrls[idTarea] = photoUrl;
            }
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


  selectTarea(activity: Activity) {
    this.activityService.setCurrentActivity(activity);
    this.router.navigate(['../', activity.idTarea], { relativeTo: this.route, replaceUrl: true },);
  }

  async checkFirmas() {
    if (!this.proyectId) {
      console.error('ID de proyecto no disponible.');
      return;
    }

    try {
      const response = await this.signService.getAllSignatureByProject(this.proyectId).toPromise() as { message: string, data: any[] };
      const firmas = response.data;
      let todasLasTareasTienenFirma = true;

      for (let firma of firmas) {
        if (!firma.isTaskLevel) {
          this.firmaExistente = true;
          return;
        }
        for (let idTarea of this.allIdTareas) {
          const firmaTarea = firmas.find(firma => firma.idTarea === idTarea && firma.isTaskLevel);
          if (!firmaTarea) {
            todasLasTareasTienenFirma = false;
            break;
          }
        }
      }
      this.firmaExistente = todasLasTareasTienenFirma;
    } catch (error) {
      this.firmaExistente = false;
    }
  }

  async downloadReport() {
    const alert = await this.alertController.create({
      header: 'Reporte',
      message: 'Se descargará el reporte completo de actividades, esto puede tomar algo de tiempo. ¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Descargar',
          handler: () => {
            this.loading = true;
            this.loadingMessage = 'Cargando reporte';
            this.reportsService.getProyectReport(this.proyectId).subscribe(
              () => {
                this.loading = false;
              },
              () => {
                this.loading = false;
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }

  goToSignPage() {
    this.router.navigate(['../../sign'], { relativeTo: this.route, state: { activityIds: this.allIdTareas } }).then(() => {
    });
  }
}


