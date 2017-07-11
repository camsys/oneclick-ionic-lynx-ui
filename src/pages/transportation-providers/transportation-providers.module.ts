import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransportationProvidersPage } from './transportation-providers';

@NgModule({
  declarations: [
    TransportationProvidersPage,
  ],
  imports: [
    IonicPageModule.forChild(TransportationProvidersPage),
  ],
  exports: [
    TransportationProvidersPage
  ]
})
export class TransportationProvidersPageModule {}
