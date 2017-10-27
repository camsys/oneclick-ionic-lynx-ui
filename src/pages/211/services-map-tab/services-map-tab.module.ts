import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicesMapTabPage } from './services-map-tab';

@NgModule({
  declarations: [
    ServicesMapTabPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicesMapTabPage),
  ],
  exports: [
    ServicesMapTabPage
  ]
})
export class ServicesMapTabPageModule {}
