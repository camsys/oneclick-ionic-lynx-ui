import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicesListPage } from './services-list';

@NgModule({
  declarations: [
    ServicesListPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicesListPage),
  ],
  exports: [
    ServicesListPage
  ]
})
export class ServicesListPageModule {}
