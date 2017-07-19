import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapFor211ServicesPage } from './map-for211-services';

@NgModule({
  declarations: [
    MapFor211ServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(MapFor211ServicesPage),
  ],
  exports: [
    MapFor211ServicesPage
  ]
})
export class MapFor211ServicesPageModule {}
