import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressbookPage } from './addressbook.page';

const routes: Routes = [
  {
    path: '',
    component: AddressbookPage,
    children: [
      {
        path: '',
        redirectTo: 'listaddress',
        pathMatch: 'full',
      },
      {
        path: 'listaddress',
        loadChildren: () =>
          import('./listaddress/listaddress.module').then(
            (m) => m.ListaddressPageModule
          ),
      },
      {
        path: 'newaddress',
        loadChildren: () =>
          import('./newaddress/newaddress.module').then(
            (m) => m.NewaddressPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddressbookPageRoutingModule {}
