import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineStorePageRoutingModule } from './online-store-routing.module';

import { OnlineStorePage } from './online-store.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlineStorePageRoutingModule
  ],
  declarations: [OnlineStorePage]
})
export class OnlineStorePageModule {}
