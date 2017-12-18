import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { OneClickProvider } from '../../providers/one-click/one-click';
import { User } from '../../models/user';
import { Eligibility } from '../../models/eligibility';
import { Accommodation } from '../../models/accommodation';
import { ParatransitServicesPage } from '../paratransit-services/paratransit-services';
import { HelpMeFindPage } from '../help-me-find/help-me-find';

import { TripRequestModel } from "../../models/trip-request";
import { TripResponseModel } from "../../models/trip-response";

/**
 * Generated class for the TransportationEligibilityPage page.
 */
@IonicPage()
@Component({
  selector: 'page-transportation-eligibility',
  templateUrl: 'transportation-eligibility.html',
})
export class TransportationEligibilityPage {
  
  user: User;
  accommodations: Accommodation[] = [];
  eligibilities: Eligibility[] = [];
  tripResponse: TripResponseModel=null;
  tripRequest: TripRequestModel;
  
  trip_id: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AuthProvider,
              public oneClick: OneClickProvider,
              private changeDetector: ChangeDetectorRef,
              public events: Events) {
    
    this.events.publish('spinner:show');            
    this.trip_id = parseInt(navParams.data.trip_id);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransportationEligibilityPage');
        
    if(this.navParams.data.trip_response && this.navParams.data.trip_request) {

      this.loadTripResponse(this.navParams.data.trip_response);
      this.loadTripRequest(this.navParams.data.trip_request);

    } else if(this.trip_id) {
      this.oneClick.getTrip(this.trip_id)
          .subscribe((tripResponse) => {
            
            let tripRequest = new TripResponseModel(tripResponse).buildTripRequest({except_filters: ["schedule", "eligibility"]});
            this.loadTripRequest(tripRequest);
            
            // Have to re-plan trip in order to get relevant eligibilities and accommodations
            this.oneClick.planTrip(tripRequest)
            .subscribe(trip => this.loadTripResponse(trip));
          });
    } else {
      // If necessary NavParams are not present, go to home page
      this.navCtrl.setRoot(HelpMeFindPage);
    }
    
  }
  
  // Loads trip response data onto the page
  loadTripResponse(tripResponse: TripResponseModel) {
    this.tripResponse = new TripResponseModel(tripResponse);

    // Pull out the relevant accommodations and eligibilities
    this.accommodations = this.tripResponse.accommodations;
    this.eligibilities = this.tripResponse.eligibilities;
    
    // If user is logged in, set the values for the eligibilities and accommodations based on their saved info
    if(this.auth.isSignedIn() && this.auth.session().user) {
      this.user = this.auth.session().user;
      this.setAccomAndEligValues();
    }
    
    this.events.publish("spinner:hide");
    this.changeDetector.detectChanges();
  }
  
  // Loads trip request data into the page
  loadTripRequest(tripRequest: TripRequestModel) {
    // Set up a tripRequest to make if any of the accommodation or eligibility values are changed
    this.tripRequest = tripRequest;
    this.tripRequest.trip_types = ["paratransit"]; // Update trip request to only request paratransit
    this.tripRequest.except_filters = ["schedule"]; // Don't filter by schedule, because we aren't letting the user pick a time      
  }
  
  // Method fires every time an accommodation or eligibility is selected or unselected
  updateCharacteristic() {
    this.changeDetector.detectChanges();
  }
  
  // Builds a user_profile update hash based on the accommodations and eligiblities hashes
  buildUserProfileParams() {
    let accs = this.accommodations.reduce((accHash, acc) => {
      accHash[acc.code] = acc.value;
      return accHash;
    }, {});
    let eligs = this.eligibilities.reduce((eligHash, elig) => {
      eligHash[elig.code] = elig.value;
      return eligHash;
    }, {});
    this.tripRequest.user_profile = {
      accommodations: accs,
      eligibilities: eligs
    };
  }
  
  // Shows all available paratransit options based on selected accommodations and eligibilities
  viewParatransitOptions() {
    this.events.publish('spinner:show');
    this.buildUserProfileParams();
    this.oneClick.planTrip(this.tripRequest)
    .subscribe((trip) => {
      this.events.publish('spinner:hide');
      this.navCtrl.push(ParatransitServicesPage, { trip_id: trip.id, trip_response: trip });
    });
  }
  
  setAccomAndEligValues() {
    this.accommodations.map((acc) => {
      let userAcc = this.user.accommodations.find((usrAccom) => usrAccom.code === acc.code);
      acc.value = userAcc.value;
    });
    this.eligibilities.map((elig) => {
      let userElig = this.user.eligibilities.find((usrElig) => usrElig.code === elig.code);
      elig.value = userElig.value;
    });
  }

}
