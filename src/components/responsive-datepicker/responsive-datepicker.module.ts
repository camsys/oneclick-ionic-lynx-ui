import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ResponsiveDatepickerComponent } from './responsive-datepicker';

@NgModule({
  declarations: [
    ResponsiveDatepickerComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    ResponsiveDatepickerComponent
  ]
})
export class ResponsiveDatepickerComponentModule {}
