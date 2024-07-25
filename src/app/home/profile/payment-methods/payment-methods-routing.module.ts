import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentMethodsPage } from './payment-methods.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodsPage,
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
        path: 'new-card',
        loadChildren: () =>
          import('./new-card/new-card.module').then((m) => m.NewCardPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodsPageRoutingModule {}
