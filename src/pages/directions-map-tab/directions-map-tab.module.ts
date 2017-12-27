import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectionsMapTabPage } from './directions-map-tab';

@NgModule({
  imports: [
    IonicPageModule.forChild(DirectionsMapTabPage),
  ]
})
export class DirectionsMapTabPageModule {}
