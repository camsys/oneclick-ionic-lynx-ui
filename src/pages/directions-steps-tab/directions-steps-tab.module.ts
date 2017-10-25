import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectionsStepsTabPage } from './directions-steps-tab';

@NgModule({
  declarations: [
    DirectionsStepsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(DirectionsStepsTabPage),
  ],
  exports: [
    DirectionsStepsTabPage
  ]
})
export class DirectionsStepsTabPageModule {}
