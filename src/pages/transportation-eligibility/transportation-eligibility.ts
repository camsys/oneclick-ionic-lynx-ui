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
    
    // Pull the trip response out of nav params and pull out the relevant accommodations and eligibilities
    this.tripResponse = new TripResponseModel(navParams.data.trip_response);
    this.accommodations = this.tripResponse.accommodations;
    this.eligibilities = this.tripResponse.eligibilities;
    
    // If user is logged in, set the values for the eligibilities and accommodations based on their saved info
    if(auth.session().user) {
      this.user = auth.session().user;
      this.setAccomAndEligValues();
    }

    // Set up a tripRequest to make if any of the accommodation or eligibility values are changed
    this.tripRequest = navParams.data.trip_request;
    this.tripRequest.trip_types = ["paratransit"]; // Update trip request to only request paratransit
    this.tripRequest.except_filters = ["schedule"]; // Don't filter by schedule, because we aren't letting the user pick a time
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
    this.events.publish('spinner:show');
    this.buildUserProfileParams();
    this.oneClickProvider
    .getTripPlan(this.tripRequest)
    .forEach((resp) => {
      this.events.publish('spinner:hide');
      this.navCtrl.push(TransportationAgenciesPage, { trip_response: resp });
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
