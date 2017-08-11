import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from './user-profile';

@NgModule({
  declarations: [
    UserProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(UserProfilePage),
  ],
  exports: [
    UserProfilePage
  ]
})
export class UserProfilePageModule {}
