import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransportationAgenciesPage } from './transportation-agencies';

@NgModule({
  declarations: [
    TransportationAgenciesPage,
  ],
  imports: [
    IonicPageModule.forChild(TransportationAgenciesPage),
  ],
  exports: [
    TransportationAgenciesPage
  ]
})
export class TransportationAgenciesPageModule {}
