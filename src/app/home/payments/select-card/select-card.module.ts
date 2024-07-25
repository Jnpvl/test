import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectCardPageRoutingModule } from './select-card-routing.module';

import { SelectCardPage } from './select-card.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectCardPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SelectCardPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectCardPageModule {}
