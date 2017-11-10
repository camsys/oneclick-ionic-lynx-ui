import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

// Providers
import { OneClickProvider } from '../../providers/one-click/one-click';

// Models
import { TripResponseModel } from "../../models/trip-response";
import { OneClickServiceModel } from "../../models/one-click-service";

// Pages
import { FeedbackModalPage } from "../feedback-modal/feedback-modal";


@IonicPage()
@Component({
  selector: 'page-paratransit-services',
  templateUrl: 'paratransit-services.html'
})
export class ParatransitServicesPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private oneClickProvider: OneClickProvider,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              private translate: TranslateService) {}
              
  tripResponse: TripResponseModel;
  transportationServices: OneClickServiceModel[];

  ionViewDidLoad() {
    this.tripResponse = this.navParams.data.trip_response;
    
    if(this.tripResponse) { 
      // If a trip response was sent via NavParams, pull the services out of it
      this.transportationServices = this.tripResponse.itineraries.map((itin) => {
        let svc = new OneClickServiceModel(itin.service);
        svc.fare = itin.cost;
        return svc;
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
          message: (data.status === 200 ? this.translate.instant("lynx.pages.feedback.success_message") : 
                                          this.translate.instant("lynx.pages.feedback.error_message")),
          position: 'bottom',
          duration: 3000
        });
        toast.present();
      }
    })
    feedbackModal.present();
  }

}
