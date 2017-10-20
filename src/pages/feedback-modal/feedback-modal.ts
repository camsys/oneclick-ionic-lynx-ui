import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  feedbackForm: FormGroup;
  
  // This is for formatting the phone input as a phone number.
  phoneMask: any = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public oneClick: OneClickProvider,
              public events: Events,
              private formBuilder: FormBuilder) {
    
    // Pull the service object out of navparams and create a feedback request for it
    this.oneclickService = this.navParams.data.oneclick_service;
    this.refernetService = this.navParams.data.refernet_service;
    this.serviceType = this.oneclickService ? "Service" : "OneclickRefernet::Service";
    
    // Build the feedback form with some default values.
    this.feedbackForm = this.formBuilder.group({
      rating: [0],
      review: [''],
      email: [''],
      phone: [''],
      feedbackable_id: [this.service().id],
      feedbackable_type: [this.serviceType]
    });
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
    let feedback = this.feedbackForm.value as FeedbackModel;
    this.unmaskData(feedback);
    this.events.publish("spinner:show");
    this.oneClick.createFeedback(feedback)
    .then((resp) => {
      this.events.publish("spinner:hide");
      this.viewCtrl.dismiss(resp);
    })    
    .catch((err) => {
      this.events.publish("spinner:hide");
      this.viewCtrl.dismiss(err);
    });
  }
  
  // Unmasks phone number data
  unmaskData(feedback: FeedbackModel) {
    feedback.phone = feedback.phone.replace(/\D+/g, '');
  }

}
