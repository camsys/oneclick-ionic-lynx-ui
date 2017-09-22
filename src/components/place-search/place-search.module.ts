import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PlaceSearchComponent } from './place-search';

@NgModule({
  declarations: [
    PlaceSearchComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    PlaceSearchComponent
  ]
})
export class PlaceSearchComponentModule {}
