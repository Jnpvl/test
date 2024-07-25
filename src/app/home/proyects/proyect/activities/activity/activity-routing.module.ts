import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityPage } from './activity.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityPage,
    children: [
      {
        path: '',
        redirectTo: 'detail',
        pathMatch: 'full',
      },
      {
        path: 'detail',
        loadChildren: () =>
          import('./detail/detail.module').then((m) => m.DetailPageModule),
      },
      {
        path: 'sign',
        loadChildren: () =>
          import('./sign/sign.module').then((m) => m.SignPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityPageRoutingModule {}
