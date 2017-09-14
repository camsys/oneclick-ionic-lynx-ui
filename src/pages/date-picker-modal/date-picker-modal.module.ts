import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatePickerModalPage } from './date-picker-modal';

@NgModule({
  declarations: [
    DatePickerModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DatePickerModalPage),
  ],
  exports: [
    DatePickerModalPage
  ]
})
export class DatePickerModalPageModule {}
