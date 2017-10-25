import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicesMapPage } from './services-map';

@NgModule({
  declarations: [
    ServicesMapPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicesMapPage),
  ],
  exports: [
    ServicesMapPage
  ]
})
export class ServicesMapPageModule {}
