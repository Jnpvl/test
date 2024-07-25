import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProyectPageRoutingModule } from './proyect-routing.module';

import { ProyectPage } from './proyect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProyectPageRoutingModule
  ],
  declarations: [ProyectPage]
})
export class ProyectPageModule {}
