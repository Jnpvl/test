import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCardComponent } from './activity-card/activity-card.component';
import { RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { CardListComponent } from './card-list/card-list.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ActivityCardComponent, CardComponent,CustomHeaderComponent,OtpVerificationComponent, CardListComponent],
  imports: [CommonModule, RouterModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ActivityCardComponent, CardComponent,CustomHeaderComponent,OtpVerificationComponent, CardListComponent],

})
export class ComponentsModule {}
