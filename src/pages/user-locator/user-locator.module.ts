import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserLocatorPage } from './user-locator';

@NgModule({
  declarations: [
    UserLocatorPage,
  ],
  imports: [
    IonicPageModule.forChild(UserLocatorPage),
  ],
  exports: [
    UserLocatorPage
  ]
})
export class UserLocatorPageModule {}
