import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackModalPage } from './feedback-modal';

@NgModule({
  declarations: [
    FeedbackModalPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackModalPage),
  ],
  exports: [
    FeedbackModalPage
  ]
})
export class FeedbackModalPageModule {}
