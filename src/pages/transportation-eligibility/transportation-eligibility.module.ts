import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransportationEligibilityPage } from './transportation-eligibility';

@NgModule({
  declarations: [
    TransportationEligibilityPage,
  ],
  imports: [
    IonicPageModule.forChild(TransportationEligibilityPage),
  ],
  exports: [
    TransportationEligibilityPage
  ]
})
export class TransportationEligibilityPageModule {}
