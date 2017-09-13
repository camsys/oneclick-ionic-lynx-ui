import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

// MODELS
import {User} from '../../models/user';
import {Eligibility} from '../../models/user';
import {Accommodation} from '../../models/user';

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

  user: User;
  eligibilities: Eligibility[];
  accommodations: Accommodation[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public oneClickProvider: OneClickProvider) {
  }

  ionViewDidLoad() {
    this.oneClickProvider.getProfile()
    .then(usr => this.user = usr)
    .then(usr => this.eligibilities = this.user.eligibilities)
    .then(usr => this.accommodations = this.user.accommodations)
    .catch((error) => this.handleError(error))
  }

  updateProfile() {
    this.user.eligibilities = this.eligibilities
    this.user.accommodations = this.accommodations
    this.oneClickProvider.updateProfile(this.user)
    .then(usr => this.user = usr)
    .then(usr => this.eligibilities = this.user.eligibilities)
    .then(usr => this.accommodations = this.user.accommodations)
    .catch((error) => this.handleError(error))
  }
  
  handleError(error) {
    // If the user token is expired, redirect to the sign in page and display a notification
    if(error.status === 401) {
      console.error("USER TOKEN EXPIRED", error);
      this.navCtrl.push(SignInPage);
      this.toastCtrl.create({
        message: "Please sign in to continue.", 
        duration: 5000}
      ).present();
    } else {
      console.error(error);
    }
  }

}
