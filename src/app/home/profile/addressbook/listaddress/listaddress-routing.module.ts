import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaddressPage } from './listaddress.page';

const routes: Routes = [
  {
    path: '',
    component: ListaddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaddressPageRoutingModule {}
