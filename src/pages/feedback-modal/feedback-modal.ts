import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';

import { OneClickServiceModel } from "../../models/one-click-service";
import { ServiceModel } from "../../models/service";
import { FeedbackModel } from "../../models/feedback";

import { OneClickProvider } from '../../providers/one-click/one-click';


/**
 * Generated class for the FeedbackModalPage page.
 */
@IonicPage()
@Component({
  selector: 'page-feedback-modal',
  templateUrl: 'feedback-modal.html',
})
export class FeedbackModalPage {
  
  refernetService: ServiceModel;
  oneclickService: OneClickServiceModel;
  serviceType: string;
  rating: number;
  feedback: FeedbackModel;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public oneClick: OneClickProvider,
              public events: Events) {
    
    // Pull the service object out of navparams and create a feedback request for it
    this.oneclickService = this.navParams.data.oneclick_service;
    this.refernetService = this.navParams.data.refernet_service;
    this.serviceType = this.oneclickService ? "Service" : "OneclickRefernet::Service";    
    this.feedback = new FeedbackModel();    
    this.feedback.feedbackable_id = this.service().id;
    this.feedback.feedbackable_type = this.serviceType;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackModalPage');
  }
  
  // Returns the service, regardless of type
  service() {
    return this.oneclickService || this.refernetService;
  }
  
  cancel() {
    this.viewCtrl.dismiss(null);
  }
  
  submit() {
    this.events.publish("spinner:show");
    this.oneClick.createFeedback(this.feedback)
    .then((resp) => {
      this.events.publish("spinner:hide");
      this.viewCtrl.dismiss(resp);
    })    
    .catch((err) => {
      this.events.publish("spinner:hide");
      this.viewCtrl.dismiss(err);
    });
  }

}
