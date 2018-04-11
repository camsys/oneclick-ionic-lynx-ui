import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmsModalPage } from './sms-modal';

@NgModule({
  imports: [
    IonicPageModule.forChild(SmsModalPage),
  ]
})
export class SmsModalPageModule {}
