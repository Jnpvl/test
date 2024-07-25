import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Proyect } from 'src/app/interfaces/proyect.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  proyects: Proyect[] = [];
  loading: boolean = false;
  constructor(private proyectSvc: ProjectService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getProyects();
    return;
  }

  getProyects() {
    this.loading = true;
    this.proyectSvc.getProyects().subscribe(
      (proyects) =>{
        this.loading = false;
        this.proyects = proyects.map(proyect =>{
          const titleNumber = proyect.proyecto.split(' ')[0];
          const titleText = proyect.proyecto.split(' ').slice(1).join(' ');
          return {
            ...proyect,
            titleNumber,
            titleText,
          };
        });
      },
      (error) => {
        console.error('Proyectos no cargados', error)
        this.loading = false;
      }
    );
  }

  selectProject(project: Proyect) {
    this.proyectSvc.setCurrentProject(project);
    this.router.navigate(['../home/proyects', project.idProyecto, 'activities'], { replaceUrl: true })
  }
}
