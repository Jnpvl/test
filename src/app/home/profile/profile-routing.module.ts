import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    children: [
      {
        path: '',
        redirectTo: 'user-data',
        pathMatch: 'full',
      },
      {
        path: 'user-data',
        loadChildren: () =>
          import('./user-data/user-data.module').then(
            (m) => m.UserDataPageModule
          ),
      },
      {
        path: 'addressbook',
        loadChildren: () =>
          import('./addressbook/addressbook.module').then(
            (m) => m.AddressbookPageModule
          ),
      },
      {
        path: 'payment-methods',
        loadChildren: () =>
          import('./payment-methods/payment-methods.module').then(
            (m) => m.PaymentMethodsPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
