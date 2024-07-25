import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationSummaryPage } from './application-summary.page';

const routes: Routes = [
  {
    path: '',
    component: ApplicationSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationSummaryPageRoutingModule {}
