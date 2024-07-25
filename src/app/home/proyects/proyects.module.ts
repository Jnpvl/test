import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProyectsPageRoutingModule } from './proyects-routing.module';

import { ProyectsPage } from './proyects.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProyectsPageRoutingModule
  ],
  declarations: [ProyectsPage]
})
export class ProyectsPageModule {}
