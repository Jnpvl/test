import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineStorePage } from './online-store.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineStorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineStorePageRoutingModule {}
