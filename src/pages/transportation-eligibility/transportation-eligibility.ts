import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { OneClickProvider } from '../../providers/one-click/one-click';
import { User, Accommodation, Eligibility } from '../../models/user';

import { TripRequestModel } from "../../models/trip-request";
import { TripResponseModel } from "../../models/trip-response";

/**
 * Generated class for the TransportationEligibilityPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-transportation-eligibility',
  templateUrl: 'transportation-eligibility.html',
})
export class TransportationEligibilityPage {
  
  user: User;
  accommodations: Accommodation[];
  eligibilities: Eligibility[];
  dirty: Boolean=false; // Have any changes been made to the accommodations or eligibilities?
  tripResponse: TripResponseModel;
  tripRequest: TripRequestModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AuthProvider,
              public oneClickProvider: OneClickProvider) {
    this.user = auth.session().user;
    this.accommodations = this.user.accommodations;
    this.eligibilities = this.user.eligibilities;
    this.tripResponse = new TripResponseModel(navParams.data.trip_response);
    this.tripRequest = navParams.data.trip_request;
    this.tripRequest.trip_types = ["paratransit"]; // Update trip request to only request paratransit
    console.log("TRIP RESPONSE AND REQUEST", this.tripResponse, this.tripRequest);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransportationEligibilityPage');
  }
  
  // Method fires every time an accommodation or eligibility is selected or unselected
  updateCharacteristic() {
    this.dirty = true; // Flip the dirty boolean to signal that a change has been made
    console.log("CHARACTERISTIC UPDATED", this.user, this.dirty);
  }
  
  // Builds a user_profile update hash based on the accommodations and eligiblities hashes
  buildUserProfileParams() {
    console.log("BUILDING USER PROFILE PARAMS...");
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
    console.log("BUILD USER PROFILE", this.tripRequest);
  }
  
  // Shows all available paratransit options based on selected accommodations and eligibilities
  viewParatransitOptions() {
    // If a change has been made, re-send the plan call.
    if(this.dirty) {
      console.log("USER IS DIRTY", this.accommodations, this.eligibilities, this.tripRequest);
      this.buildUserProfileParams();
      // MAKE A TRIP PLAN CALL BEFORE GOING TO NEXT PAGE
    } else {
      // GO DIRECTLY TO NEXT PAGE
    }
    console.log("VIEWING PARATRANSIT OPTIONS...");
  }

}
