import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Activity, Photo } from 'src/app/interfaces/activity.interface';
import { Firma } from 'src/app/interfaces/firma.interface';
import { Proyect } from 'src/app/interfaces/proyect.interface';
import { ActivityService } from 'src/app/services/activity.service';
import { ProjectService } from 'src/app/services/project.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SignatureService } from 'src/app/services/signature.service';
import { SwiperOptions } from 'swiper/types/swiper-options';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  loading: boolean = false;
  loadingMessage: string = '';
  proyectId = '';
  activity: Activity | null = null;
  idTarea: string = '';
  photoDetails: {
    loaded: boolean; url: string, notas: string | null
  }[] = [];
  allImagesLoaded: boolean = false;
  firmaExistente: boolean = false;
  firmaPhoto: any;

  constructor(
    private activityService: ActivityService,
    private signService: SignatureService,
    private projectService: ProjectService,
    private alertController: AlertController,
    private reportsService:ReportsService
  ) { }

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: { clickable: true },
    navigation: true
  };

  ionViewWillEnter() {
    this.getFirma();
    this.getPhotos(this.idTarea);
  }

  ngOnInit() {
    const currentProject: Proyect | null = this.projectService.getCurrentProject();
    if (currentProject) {
      this.proyectId = currentProject.idProyecto;
    } else {
      console.log('No hay proyectos en el servicio.');
    }
    this.activity = this.activityService.getCurrentActivity();
    this.idTarea = this.activity?.idTarea || '';
    if (this.idTarea) {
      this.getPhotos(this.idTarea);
    }
    this.getFirma();
  }

  getPhotos(idTarea: string) {
    this.activityService.getPhotos(idTarea)
      .subscribe(
        (photos: any[]) => {
          if (photos.length > 0) {
              this.photoDetails = photos.filter(photo => {
                  if (photo.notas === 'Firma') {
                      this.firmaPhoto = photo;  
                      return false; 
                  }
                  return true;  
              }).map(photo => {
                  return {
                      url: photo.urlImagen, 
                      notas: photo.notas || 'No hay descripción.',
                      loaded: false
                  };
              }); 
          } else {
              console.log('No photos available for this activity.');
          }
      },
        error => {
          console.error('Error al obtener fotos:', error);
        }
      );
  }
  

  async getFirma() {
    this.firmaExistente = false;
    if (this.proyectId) {
      try {
        const response = await this.signService.getAllSignatureByProject(this.proyectId).toPromise() as { data: any[] };
        const projectSignature = response.data.find(firma => firma.isTaskLevel === false);
        if (projectSignature) {
          this.firmaExistente = true;
        } else {
          if (this.idTarea) {
            const taskSignature = await this.signService.getSignature(this.proyectId, this.idTarea).toPromise() as Firma;
            if (taskSignature && taskSignature.data && taskSignature.data.idTarea && taskSignature.data.isTaskLevel === true) {
              this.firmaExistente = true;
            } else {
              this.firmaExistente = false;
            }
          } else {
            this.firmaExistente = false;
          }
        }
      } catch (err) {
        this.firmaExistente = false;
      }
    } else {
      console.error('ID de proyecto no disponible.');
    }
  }

  async downloadReport(){
    const alert = await this.alertController.create({
      header: 'Reporte',
      message: 'Se descargará el reporte completo de la actividad, esto puede tomar algo de tiempo. ¿Deseas continuar?',
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
            this.reportsService.getProyectReport(this.proyectId,this.idTarea).subscribe(
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


}