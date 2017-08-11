import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectTransporationFinderPage } from './direct-transporation-finder';

@NgModule({
  declarations: [
    DirectTransporationFinderPage,
  ],
  imports: [
    IonicPageModule.forChild(DirectTransporationFinderPage),
  ],
  exports: [
    DirectTransporationFinderPage
  ]
})
export class DirectTransporationFinderPageModule {}
