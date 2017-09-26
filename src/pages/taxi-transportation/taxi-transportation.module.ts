import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaxiTransportationPage } from './taxi-transportation';

@NgModule({
  declarations: [
    TaxiTransportationPage,
  ],
  imports: [
    IonicPageModule.forChild(TaxiTransportationPage),
  ],
  exports: [
    TaxiTransportationPage
  ]
})
export class TaxiTransportationPageModule {}
