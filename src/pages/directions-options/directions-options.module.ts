import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectionsOptionsPage } from './directions-options';

@NgModule({
  declarations: [
    DirectionsOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(DirectionsOptionsPage),
  ],
  exports: [
    DirectionsOptionsPage
  ]
})
export class DirectionsOptionsPageModule {}
