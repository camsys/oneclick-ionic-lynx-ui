import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationAutoCompletePage } from './location-auto-complete';

@NgModule({
  declarations: [
    LocationAutoCompletePage,
  ],
  imports: [
    IonicPageModule.forChild(LocationAutoCompletePage),
  ],
  exports: [
    LocationAutoCompletePage
  ]
})
export class LocationAutoCompletePageModule {}
