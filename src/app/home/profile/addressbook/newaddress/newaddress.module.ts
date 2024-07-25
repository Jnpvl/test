import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewaddressPageRoutingModule } from './newaddress-routing.module';

import { NewaddressPage } from './newaddress.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewaddressPageRoutingModule,
  ],
  declarations: [NewaddressPage],
})
export class NewaddressPageModule {}
