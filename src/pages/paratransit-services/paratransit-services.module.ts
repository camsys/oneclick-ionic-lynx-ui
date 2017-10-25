import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParatransitServicesPage } from './paratransit-services';

@NgModule({
  declarations: [
    ParatransitServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(ParatransitServicesPage),
  ],
  exports: [
    ParatransitServicesPage
  ]
})
export class ParatransitServicesPageModule {}
