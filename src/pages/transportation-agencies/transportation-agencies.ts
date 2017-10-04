import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

// Providers
import { OneClickProvider } from '../../providers/one-click/one-click';
import { HelpersProvider } from '../../providers/helpers/helpers';

// Models
import { TripResponseModel } from "../../models/trip-response";
import { OneClickServiceModel } from "../../models/one-click-service";

// Pages
import { FeedbackModalPage } from "../feedback-modal/feedback-modal";


@IonicPage()
@Component({
  selector: 'page-transportation-agencies',
  templateUrl: 'transportation-agencies.html'
})
export class TransportationAgenciesPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private oneClickProvider: OneClickProvider,
              private helpers: HelpersProvider,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController) {}
              
  tripResponse: TripResponseModel;
  transportationServices: OneClickServiceModel[];

  ionViewDidLoad() {
    this.tripResponse = this.navParams.data.trip_response;
    
    if(this.tripResponse) { 
      // If a trip response was sent via NavParams, pull the services out of it
      this.transportationServices = this.tripResponse.itineraries.map((itin) => {
        return new OneClickServiceModel(itin.service);
      })
    } else {
      // Otherwise, make a call to OneClick for an index of all services
      this.oneClickProvider.getParatransitServices()
      .then(tps => this.transportationServices = tps);
    }
  }
  
  // Open the feedback modal for rating the service
  rateService(service: OneClickServiceModel) {
    let feedbackModal = this.modalCtrl.create(FeedbackModalPage, { oneclick_service: service });
    feedbackModal.onDidDismiss(data => {
      if(data) {
        let toast = this.toastCtrl.create({
          message: (data.status === 200 ? 'Feedback created successfully' : 'Error creating feedback'),
          position: 'bottom',
          duration: 3000
        });
        toast.present();
      }
    })
    feedbackModal.present();
  }

}
