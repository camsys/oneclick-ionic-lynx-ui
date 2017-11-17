import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, ToastController } from 'ionic-angular';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { TranslateService } from '@ngx-translate/core';

// Pages
import { FeedbackModalPage } from "../../feedback-modal/feedback-modal";
import { DirectionsPage } from '../../directions/directions';
import { TransportationEligibilityPage } from '../../transportation-eligibility/transportation-eligibility';
import { TaxiServicesPage } from '../../taxi-services/taxi-services';

// Models
import { ServiceModel } from '../../../models/service';
import { TripRequestModel } from "../../../models/trip-request";
import { TripResponseModel } from "../../../models/trip-response";
import { Session } from '../../../models/session';
import { GooglePlaceModel } from "../../../models/google-place";

//Providers
import { OneClickProvider } from '../../../providers/one-click/one-click';

/**
 * Generated class for the ServiceFor211DetailPage page.
 */
@IonicPage()
@Component({
  selector: 'page-service-for211-detail',
  templateUrl: 'service-for211-detail.html',
})
export class ServiceFor211DetailPage {

  service: ServiceModel;
  origin: GooglePlaceModel;
  destination: GooglePlaceModel;
  basicModes:string[] = ['transit', 'car', 'taxi', 'uber'] // All available modes except paratransit
  allModes:string[] = ['transit', 'car', 'taxi', 'uber', 'paratransit'] // All modes
  tripRequest: TripRequestModel;
  tripResponse: TripResponseModel = new TripResponseModel({});
  tripPlanSubscription: any;
  detailKeys: string[] = []; // Array of the non-null detail keys in the details hash

  transitTime: number = 0;
  driveTime: number = 0;

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public oneClickProvider: OneClickProvider,
              public events: Events,
              private inAppBrowser: InAppBrowser,
              public changeDetector: ChangeDetectorRef,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private translate: TranslateService) {

    // Set the service (if present)
    this.service = navParams.data.service;

    // Set origin and destination places
    this.origin = new GooglePlaceModel(navParams.data.origin);
    this.destination = new GooglePlaceModel(navParams.data.destination);
    
    // Set the detail keys to the non-null details
    this.detailKeys = Object.keys(this.service.details)
                            .filter((k) => this.service.details[k] !== null);
                            
    // Replace newline characters with html break tags in detail strings
    this.detailKeys.forEach((k) => 
      { 
        this.service.details[k] = this.service.details[k]
                                              .replace(/(?:\r\n|\r|\n)/g, '<br />');
      }
    );

    // Show the spinner until the trip plan call returns
    this.events.publish('spinner:show');

    // Plan a trip and store the result.
    // Once response comes in, update the UI with travel times and allow
    // user to select a mode to view directions.
    this.tripPlanSubscription = this.oneClickProvider // Store the subscription in a property so it can be unsubscribed from if necessary
    .getTripPlan(this.buildTripRequest(this.allModes))
    .subscribe((resp) => {
      this.tripResponse = new TripResponseModel(resp);
      this.updateTravelTimesFromTripResponse(this.tripResponse);
      this.events.publish('spinner:hide');
      this.changeDetector.detectChanges();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceFor211DetailPage');
  }

  // On page leave, unsubscribe from the trip plan call so it doesn't trigger errors when it resolves
  ionViewWillLeave() {
    if(this.tripPlanSubscription) {
      this.tripPlanSubscription.unsubscribe();
    }
  }

  // Opens the directions page for the desired mode, passing a clone of the
  // trip response with all the irrelevant itineraries filtered out.
  openDirectionsPage(mode: string) {
    let tripResponse = this.tripResponseWithFilteredItineraries(this.tripResponse, mode);

    if (mode === 'car' || mode === 'transit'){
      this.navCtrl.push(DirectionsPage, {
        trip_response: tripResponse,
        mode: mode
      });
    } else if (mode === 'taxi') {
      this.navCtrl.push(TaxiServicesPage, {
        trip_response: tripResponse,
        mode: mode
      });
    } else if (mode === 'uber') {
      this.openUrl('https://m.uber.com/ul?&amp;client_id=Qu7RDPXW65A6G-JqqIgnbsfYglolUTIm&amp;action=setPickup&amp;'+
        'pickup[latitude]='+tripResponse.origin.lat+'&amp;pickup[longitude]='+tripResponse.origin.lng+
        '&amp;dropoff[latitude]='+tripResponse.destination.lat+'&amp;dropoff[longitude]='+tripResponse.destination.lng)
    }
  }

  openOtherTransportationOptions(){
    this.navCtrl.push(TransportationEligibilityPage, {
      trip_response: this.tripResponseWithFilteredItineraries(this.tripResponse, 'paratransit'),
      trip_request: this.tripRequest
    })
  }

  // Builds a trip request based on the passed mode, stored origin/destination,
  // and current time
  buildTripRequest(modes: string[]) {
    let tripRequest = this.tripRequest = new TripRequestModel();

    // Set origin and destination
    tripRequest.trip.origin_attributes = this.origin.toOneClickPlace();
    tripRequest.trip.destination_attributes = this.destination.toOneClickPlace();

    // Set trip time to now by default, in ISO 8601 format
    tripRequest.trip.trip_time = new Date().toISOString();

    // Set arrive_by to true by default
    tripRequest.trip.arrive_by = false;

    // Set trip types to the mode passed to this method
    tripRequest.trip_types = modes;

    // Don't filter by schedule, because we aren't letting the user pick a time for paratransit or taxi
    // Also don't filter by eligibility, as doing so may exclude relevant results from the fare preview
    this.tripRequest.except_filters = ["schedule", "eligibility"];

    return tripRequest;
  }

  // Updates transit and drive time based on a trip response
  updateTravelTimesFromTripResponse(tripResponse: TripResponseModel) {
    let transitItin = tripResponse.itinerariesByTripType('transit')[0];
    if(transitItin && transitItin.duration) {
      this.transitTime = transitItin.duration;
    }

    let driveItin = tripResponse.itinerariesByTripType('car')[0];
    if(driveItin && driveItin.duration) {
      this.driveTime = driveItin.duration;
    }
  }

  // Returns a trip response object but with only the itineraries of the passed mode
  tripResponseWithFilteredItineraries(tripResponse: TripResponseModel,
                                      mode: string) {
    if(!tripResponse) { return null; } // Return null if no tripResponse is present
    let newTripResponse = new TripResponseModel(tripResponse);
    newTripResponse.itineraries = newTripResponse.itinerariesByTripType(mode);
    return newTripResponse;
  }

  // Returns duration in seconds for the given mode
  durationFor(mode:string): number {
    switch(mode) {
      case 'transit':
        return this.transitTime;
      case 'car':
      case 'taxi':
        return this.driveTime;
      case 'uber':
        return this.driveTime;
      case 'paratransit':
        return this.driveTime;
      default:
        return this.driveTime;
    }
  }

  // Returns a label for the passed mode
  labelFor(mode:string): string {
    switch(mode) {
      case 'transit':
        return "Bus & Train";
      case 'car':
        return "Drive";
      case 'taxi':
        return "Taxi";
      case 'uber':
        return "Uber";
      case 'paratransit':
        return "Other Transportation Options";
      default:
        return "";
    }
  }

  rateService(service: ServiceModel) {
    FeedbackModalPage.createModal(this.modalCtrl, 
                                  this.toastCtrl,
                                  this.translate,
                                { subject: service, type: "OneclickRefernet::Service" })
                     .present();
  }

  openUrl(url: string) {
    let browser = this.inAppBrowser.create(url);
    browser.show();
  }

}
