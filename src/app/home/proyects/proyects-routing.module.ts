import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProyectsPage } from './proyects.page';

const routes: Routes = [
  {
    path: '',
    component: ProyectsPage,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./list/list.module').then((m) => m.ListPageModule),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./proyect/proyect.module').then((m) => m.ProyectPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProyectsPageRoutingModule {}
