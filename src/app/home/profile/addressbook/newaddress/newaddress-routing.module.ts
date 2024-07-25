import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewaddressPage } from './newaddress.page';

const routes: Routes = [
  {
    path: '',
    component: NewaddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewaddressPageRoutingModule {}
