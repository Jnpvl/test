import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectCardPage } from './select-card.page';

const routes: Routes = [
  {
    path: '',
    component: SelectCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectCardPageRoutingModule {}
