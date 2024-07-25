import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then(
            (m) => m.DashboardPageModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'documents',
        loadChildren: () =>
          import('./documents/documents.module').then(
            (m) => m.DocumentsPageModule
          ),
      },
      {
        path: 'proyects',
        loadChildren: () =>
          import('./proyects/proyects.module').then(
            (m) => m.ProyectsPageModule
          ),
      },
      {
        path: 'online-store',
        loadChildren: () =>
          import('./online-store/online-store.module').then(
            (m) => m.OnlineStorePageModule
          ),
      },
      {
        path: 'schedule-service',
        loadChildren: () =>
          import('./schedule-service/schedule-service.module').then(
            (m) => m.ScheduleServicePageModule
          ),
      },
      {
        path: 'payments',
        loadChildren: () => 
          import('./payments/payments.module').then(
            m => m.PaymentsPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
