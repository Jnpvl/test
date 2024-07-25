import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpVerificationPageRoutingModule } from './otp-verification-routing.module';

import { OtpVerificationPage } from './otp-verification.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpVerificationPageRoutingModule,
    ComponentsModule
  ],
  declarations: [OtpVerificationPage]
})
export class OtpVerificationPageModule {}
