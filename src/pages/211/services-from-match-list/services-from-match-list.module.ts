import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicesFromMatchListPage } from './services-from-match-list';

@NgModule({
  declarations: [
    ServicesFromMatchListPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicesFromMatchListPage),
  ],
  exports: [
    ServicesFromMatchListPage
  ]
})
export class ServicesFromMatchListPageModule {}
