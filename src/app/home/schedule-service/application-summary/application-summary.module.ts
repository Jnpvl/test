import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplicationSummaryPageRoutingModule } from './application-summary-routing.module';

import { ApplicationSummaryPage } from './application-summary.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicationSummaryPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ApplicationSummaryPage]
})
export class ApplicationSummaryPageModule {}
