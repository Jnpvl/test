import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleServicePageRoutingModule } from './schedule-service-routing.module';

import { ScheduleServicePage } from './schedule-service.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleServicePageRoutingModule
  ],
  declarations: [ScheduleServicePage]
})
export class ScheduleServicePageModule {}
