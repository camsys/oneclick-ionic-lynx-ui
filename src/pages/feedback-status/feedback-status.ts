import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { OneClickProvider } from '../../providers/one-click/one-click';

import { FeedbackModel } from '../../models/feedback';

@IonicPage()
@Component({
  selector: 'page-feedback-status',
  templateUrl: 'feedback-status.html',
})
export class FeedbackStatusPage {
  
  feedbacks: FeedbackModel[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private oneClick: OneClickProvider) {
  }

  ionViewDidLoad() {
    this.oneClick.getFeedbacks()
                 .subscribe((feedbacks) => this.feedbacks = feedbacks);
  }

}
