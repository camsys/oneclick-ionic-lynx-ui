import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectionsMapTabPage } from './directions-map-tab';

@NgModule({
  declarations: [
    DirectionsMapTabPage,
  ],
  imports: [
    IonicPageModule.forChild(DirectionsMapTabPage),
  ],
  exports: [
    DirectionsMapTabPage
  ]
})
export class DirectionsMapTabPageModule {}
