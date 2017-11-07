import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicesListTabPage } from './services-list-tab';

@NgModule({
  declarations: [
    ServicesListTabPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicesListTabPage),
  ],
  exports: [
    ServicesListTabPage
  ]
})
export class ServicesListTabPageModule {}
