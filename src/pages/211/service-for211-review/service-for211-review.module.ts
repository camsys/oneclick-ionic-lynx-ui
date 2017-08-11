import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceFor211ReviewPage } from './service-for211-review';

@NgModule({
  declarations: [
    ServiceFor211ReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceFor211ReviewPage),
  ],
  exports: [
    ServiceFor211ReviewPage
  ]
})
export class ServiceFor211ReviewPageModule {}
