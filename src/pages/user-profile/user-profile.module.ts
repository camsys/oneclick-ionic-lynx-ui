import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from './user-profile';

@NgModule({
  imports: [
    IonicPageModule.forChild(UserProfilePage),
  ]
})
export class UserProfilePageModule {}
