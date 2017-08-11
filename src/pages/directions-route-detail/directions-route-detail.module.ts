import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectionsRouteDetailPage } from './directions-route-detail';

@NgModule({
  declarations: [
    DirectionsRouteDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DirectionsRouteDetailPage),
  ],
  exports: [
    DirectionsRouteDetailPage
  ]
})
export class DirectionsRouteDetailPageModule {}
