import { Component, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams, 
         Events, ModalController, ToastController,
         Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

// Pages
import { FeedbackModalPage } from "../../feedback-modal/feedback-modal";
import { EmailModalPage } from "../../email-modal/email-modal";
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
import { ExternalNavigationProvider } from '../../../providers/external-navigation/external-navigation';

/**
 * Generated class for the ServiceFor211DetailPage page.
 */
@IonicPage()
@Component({
  selector: 'page-service-for211-detail',
  templateUrl: 'service-for211-detail.html',
})
export class ServiceFor211DetailPage {
  
  // Detect when the screen is resized and resize the content based on the
  // new header bar height.
  @ViewChild(Content) content: Content;
  @HostListener('window:resize') onResize() {
    this.content && this.content.resize();
  }

  service: ServiceModel;
  origin: GooglePlaceModel;
  destination: GooglePlaceModel;
  basicModes:string[] = ['transit', 'car', 'taxi', 'uber'] // All available modes except paratransit
  allModes:string[] = ['transit', 'car', 'taxi', 'uber', 'paratransit'] // All modes
  returnedModes:string[] = [] // All the basic modes returned from the plan call
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
              public changeDetector: ChangeDetectorRef,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private translate: TranslateService,
              public exNav: ExternalNavigationProvider) {

    // Set the service (if present)
    this.service = JSON.parse(this.navParams.data.service) as ServiceModel;
    
    if(this.service) {
      // Set the detail keys to the non-null details
      this.detailKeys = Object.keys(this.service.details)
                              .filter((k) => this.service.details[k] !== null);
    }
    
    // Set origin and destination places
    this.origin = new GooglePlaceModel(JSON.parse(this.navParams.data.origin));
    this.destination = new GooglePlaceModel(JSON.parse(this.navParams.data.destination));
    
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
    .planTrip(this.buildTripRequest(this.allModes))
    .subscribe((resp) => {
      this.tripResponse = new TripResponseModel(resp);
      this.updateTravelTimesFromTripResponse(this.tripResponse);
      this.updateReturnedModes(this.tripResponse);
      this.events.publish('spinner:hide');
      this.changeDetector.detectChanges();
    });
    
  }

  ionViewDidEnter() {
    this.content.resize(); // Make sure content isn't covered by navbar
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
    let tripResponse = this.tripResponse.withFilteredItineraries(mode);

    if (mode === 'car' || mode === 'transit'){
      this.navCtrl.push(DirectionsPage, {
        trip_response: tripResponse,
        trip_id: tripResponse.id,
        mode: mode
      });
    } else if (mode === 'taxi') {
      this.navCtrl.push(TaxiServicesPage, {
        trip_response: tripResponse,
        trip_id: tripResponse.id,
        mode: mode
      });
    } else if (mode === 'uber') {
      let uberUrl = encodeURI(
        'https://m.uber.com/ul/?' +
        'action=setPickup' +
        '&client_id=Qu7RDPXW65A6G-JqqIgnbsfYglolUTIm' + 
        '&pickup[latitude]=' + tripResponse.origin.lat + 
        '&pickup[longitude]=' + tripResponse.origin.lng +
        '&dropoff[latitude]=' + tripResponse.destination.lat + 
        '&dropoff[longitude]=' + tripResponse.destination.lng
      );
      
      this.exNav.goTo(uberUrl);
    }
  }

  openOtherTransportationOptions(){
    this.navCtrl.push(TransportationEligibilityPage, {
      trip_response: this.tripResponse.withFilteredItineraries('paratransit'),
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

  // Updates the returned modes list with the modes returned from the given response
  updateReturnedModes(tripResponse: TripResponseModel) {
    this.returnedModes = this.basicModes.filter((mode) => {
      return tripResponse.includesTripType(mode);
    })
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

  openEmailModal(service: ServiceModel) {
    let emailModal = this.modalCtrl.create(EmailModalPage, {service: service});
    emailModal.present();
  }

}
