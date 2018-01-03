import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../app/environment';

// MODELS
import {User} from '../../models/user';
import {Eligibility} from '../../models/eligibility';
import {Accommodation} from '../../models/accommodation';
import {TripType} from '../../models/user';

// PROVIDERS
import { OneClickProvider } from '../../providers/one-click/one-click';

// PAGES
import { SignInPage }  from '../sign-in/sign-in';


/**
 * Generated class for the UserProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  user: User = {} as User;
  eligibilities: Eligibility[];
  accommodations: Accommodation[];
  trip_types: TripType[];
  filtered_trip_types: TripType[];
  available_locales: string[];

  @ViewChild('updateProfileForm') updateProfileForm: NgForm = {} as NgForm;
  public passwordFieldType = "password";
  public showPassword = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public oneClickProvider: OneClickProvider,
              private translate: TranslateService) {
    this.available_locales = environment.AVAILABLE_LOCALES;
  }

  ionViewDidLoad() {
    this.oneClickProvider.getProfile()
    .then((user) => this.updateUserData(user))
    .catch((error) => this.handleError(error))
  }

  updateProfile() {
    this.user.eligibilities = this.eligibilities;
    this.user.accommodations = this.accommodations;
    this.user.trip_types = this.trip_types;
    if(this.user.password && this.user.password.length > 0) {
      this.user.password_confirmation = this.user.password;
    }
    this.oneClickProvider.updateProfile(this.user)
    .then((user) => this.updateUserData(user))
    .catch((error) => this.handleError(error))
  }

  updateUserData(user: User) {
    this.user = user;
    this.eligibilities = this.user.eligibilities;
    this.accommodations = this.user.accommodations;
    this.trip_types = this.user.trip_types;
    this.filterTripTypes();
  }

  filterTripTypes() {
    this.filtered_trip_types = [];
    var allowed = ["transit", "paratransit", "car", "taxi", "uber"];
    for (var i = 0; i < this.user.trip_types.length; i++) {
      if(allowed.indexOf(this.user.trip_types[i].code) > -1){
        this.filtered_trip_types.push(this.user.trip_types[i]);
      }
    }
    this.trip_types = this.filtered_trip_types;
    this.user.trip_types = this.filtered_trip_types;
  }

  handleError(error) {
    // If the user token is expired, redirect to the sign in page and display a notification
    if(error.status === 401) {
      console.error("USER TOKEN EXPIRED", error);
      this.navCtrl.push(SignInPage);
      this.toastCtrl.create({
        message: this.translate.instant("lynx.pages.user_profile.sign_in_required_message"),
        duration: 5000}
      ).present();
    } else {
      console.error(error);
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    if (this.showPassword){
      this.passwordFieldType = "type";
    } else {
      this.passwordFieldType = "password";
    }
  }

}
