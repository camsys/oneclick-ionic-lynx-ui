import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceFor211DetailPage } from './service-for211-detail';

@NgModule({
  declarations: [
    ServiceFor211DetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceFor211DetailPage),
  ],
  exports: [
    ServiceFor211DetailPage
  ]
})
export class ServiceFor211DetailPageModule {}
