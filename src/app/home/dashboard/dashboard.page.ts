import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { USER } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { Proyect } from 'src/app/interfaces/proyect.interface';
import { ActivityService } from 'src/app/services/activity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  user: USER | null = null;
  projects: Proyect[] = [];
  loading: boolean = false;

  menu = [
    {
      title: 'Proyectos',
      url: '/home/proyects',
      icon: 'm_proyectos.svg',
    },
    {
      title: 'Agendar servicio',
      url: '/home/schedule-service',
      icon: 'm_agendar.svg',
    },
    {
      title: 'Servicio URGENTE',
      url: '/home/schedule-service',
      icon: 'm_serviciourgente.svg',
    },
    {
      title: 'Documentos',
      url: '/home/documents',
      icon: 'm_documentos.svg',
    },
    {
      title: 'Saldos / Pagos',
      url: '/home/payments',
      icon: 'm_saldospagos.svg',
    },
    {
      title: 'Tienda en linea',
      url: '/home/online-store',
      icon: 'm_tienda.svg',
    },
    {
      title: 'Ajustes de perfil',
      url: '/home/profile',
      icon: 'm_ajustes.svg',
    },
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private proyectSvc: ProjectService,
    private activityService: ActivityService,
    private router: Router
  ) {
  }
  
  ionViewWillEnter(){
    this.user = this.userService.getUser();
  }

  ngOnInit() {
    this.getProyects();
  }

  getProyects() {
    this.loading = true;
    this.proyectSvc.getTop5Proyects().subscribe(
      (projects) => {
        this.loading = false;
        this.projects = projects.map(project => {
          const titleNumber = project.proyecto.split(' ')[0];
          const titleText = project.proyecto.split(' ').slice(1).join(' ');
          return {
            ...project,
            titleNumber,
            titleText,
            isPdf: false
          };
        });

        this.projects.forEach(project => {
          this.getActivities(project.idProyecto);
        });
      },
      (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    );
  }

  getActivities(idProyecto: string) {
    this.loading = true;
    this.activityService.getActivities(idProyecto).subscribe(
      (activities) => {
        this.loading = false;
        if (activities.length > 0) {
          const firstActivity = activities[0];
          this.getPhotos(firstActivity.idTarea, idProyecto);
        }
      },
      (error) => {
        console.error('Error al obtener actividades:', error);
        this.loading = false;
      }
    );
  }

  getPhotos(idTarea: string, idProyecto: string) {
    this.activityService.getPhotos(idTarea).subscribe(
      photos => {
        const project = this.projects.find(p => p.idProyecto === idProyecto);
        if (project) {
          if (photos && photos.length > 0) {
            const firstPhoto = photos[0];
            const photoUrl = firstPhoto.urlImagen;
            if (photoUrl.toLowerCase().endsWith('.pdf')) {
              project.photoUrl = 'assets/images/otrowhite.png';
              project.isPdf = true;
            } else if (firstPhoto.notas.trim() === 'Firma') {
              project.photoUrl = undefined;
              project.isPdf = false;
            } else {
              project.photoUrl = photoUrl;
              project.isPdf = false;
            }
          } else {
            project.photoUrl = undefined;
            project.isPdf = false;
          }
        }
      },
      error => {
        console.error('Error al obtener fotos:', error);
      }
    );
  }


  selectProject(project: Proyect) {
    this.proyectSvc.setCurrentProject(project);
    this.router.navigate(['../home/proyects', project.idProyecto, 'activities'], { replaceUrl: true });
  }
  
  cerrarSesion() {
    this.authService.logout();
    window.location.href = '/';
  }
}