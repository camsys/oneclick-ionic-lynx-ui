import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaxiServicesPage } from './taxi-services';

@NgModule({
  declarations: [
    TaxiServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(TaxiServicesPage),
  ],
  exports: [
    TaxiServicesPage
  ]
})
export class TaxiServicesPageModule {}
