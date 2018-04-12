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
  
  tripResponse: TripResponseModel;
  transportationServices: OneClickServiceModel[];

  trip_id: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private oneClick: OneClickProvider,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              private translate: TranslateService) {
  
    this.trip_id = this.navParams.data.trip_id;
    this.transportationServices = null;              
  }

  ionViewDidLoad() {
    
    if(this.navParams.data.trip_response) { // If a trip object is passed, load its services
      this.loadTripResponse(this.navParams.data.trip_response);
    } else if(this.trip_id) { // If a trip_id is passed, get the trip from OneClick and load its services
      this.oneClick.getTrip(this.trip_id)
      .subscribe(trip => this.loadTripResponse(trip));
    } else { // Otherwise, make a call to OneClick for an index of all services
      this.oneClick.getParatransitServices()
      .then(tps => this.transportationServices = tps);
    }
  }
  
  // Loads trip response data onto the page
  loadTripResponse(tripResponse: TripResponseModel) {
    this.tripResponse = new TripResponseModel(tripResponse).withFilteredItineraries('paratransit');
    
    // If a trip response was sent via NavParams, pull the services out of it
    this.transportationServices = this.tripResponse.itineraries.map((itin) => {
      let svc = new OneClickServiceModel(itin.service);
      svc.fare = itin.cost;
      return svc;
     })
  }
  
  // Open the feedback modal for rating the service
  rateService(service: OneClickServiceModel) {
    FeedbackModalPage.createModal(this.modalCtrl, 
                                  this.toastCtrl,
                                  this.translate,
                                { subject: service, type: "Service" })
                     .present();
  }

}
