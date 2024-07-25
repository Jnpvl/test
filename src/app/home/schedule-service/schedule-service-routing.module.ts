import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleServicePage } from './schedule-service.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleServicePage,
    children: [
      {
        path: '',
        redirectTo: 'schedule',
        pathMatch: 'full',
      },
      {
        path: 'schedule',
        loadChildren: () =>
          import('./schedule/schedule.module').then(
            (m) => m.SchedulePageModule
          ),
      },
      {
        path: 'direction',
        loadChildren: () =>
          import('./direction/direction.module').then(
            (m) => m.DirectionPageModule
          ),
      },
      {
        path: 'application-summary',
        loadChildren: () =>
          import('./application-summary/application-summary.module').then(
            (m) => m.ApplicationSummaryPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleServicePageRoutingModule {}
