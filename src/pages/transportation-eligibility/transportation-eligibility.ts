import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { OneClickProvider } from '../../providers/one-click/one-click';
import { User, Accommodation, Eligibility } from '../../models/user';
import { TransportationAgenciesPage } from '../transportation-agencies/transportation-agencies';

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
  dirty: Boolean=false; // Have any changes been made to the accommodations or eligibilities?
  tripResponse: TripResponseModel=null;
  tripRequest: TripRequestModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AuthProvider,
              public oneClickProvider: OneClickProvider,
              private changeDetector: ChangeDetectorRef,
              public events: Events) {
                
    if(auth.session().user) {
      this.user = auth.session().user;
      this.accommodations = this.user.accommodations;
      this.eligibilities = this.user.eligibilities;
    }
    
    if(navParams.data.trip_response) {
      this.tripResponse = new TripResponseModel(navParams.data.trip_response);
    }
    this.tripRequest = navParams.data.trip_request;
    this.tripRequest.trip_types = ["paratransit"]; // Update trip request to only request paratransit
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransportationEligibilityPage');
  }
  
  // Method fires every time an accommodation or eligibility is selected or unselected
  updateCharacteristic() {
    this.dirty = true; // Flip the dirty boolean to signal that a change has been made
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
    // If a change has been made, or no trip response is present, re-send the plan call.
    if(this.dirty || !this.tripResponse) {
      this.events.publish('spinner:show');
      this.buildUserProfileParams();
      this.oneClickProvider
      .getTripPlan(this.tripRequest)
      .forEach((resp) => {
        this.events.publish('spinner:hide');
        this.navCtrl.push(TransportationAgenciesPage, { trip_response: resp });
      });
    } else {
      // GO DIRECTLY TO NEXT PAGE
      this.navCtrl.push(TransportationAgenciesPage, { trip_response: this.tripResponse });
    }
  }

}
