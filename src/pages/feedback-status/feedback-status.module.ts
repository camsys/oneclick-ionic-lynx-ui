import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackStatusPage } from './feedback-status';

@NgModule({
  declarations: [
    FeedbackStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackStatusPage),
  ],
  exports: [
    FeedbackStatusPage
  ]
})
export class FeedbackStatusPageModule {}
