import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProyectPage } from './proyect.page';

const routes: Routes = [
  {
    path: '',
    component: ProyectPage,
    children: [
      {
        path: '',
        redirectTo: 'activities',
        pathMatch: 'full',
      },
      {
        path: 'sign',
        loadChildren: () =>
          import('./sign/sign.module').then((m) => m.SignPageModule),
      },
      {
        path: 'activities',
        loadChildren: () =>
          import('./activities/activities.module').then(
            (m) => m.ActivitiesPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProyectPageRoutingModule {}
