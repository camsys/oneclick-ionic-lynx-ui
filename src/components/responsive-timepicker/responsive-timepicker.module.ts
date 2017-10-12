import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ResponsiveTimepickerComponent } from './responsive-timepicker';

@NgModule({
  declarations: [
    ResponsiveTimepickerComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    ResponsiveTimepickerComponent
  ]
})
export class ResponsiveTimepickerComponentModule {}
