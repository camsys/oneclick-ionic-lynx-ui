import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user/user-service'
import {User} from '../../models/user';
import {Eligibility} from '../../models/user';
import {Accommodation} from '../../models/user';
import { OneClickProvider } from '../../providers/one-click/one-click';



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

  constructor(public navCtrl: NavController, public navParams: NavParams, public userServiceProvider: UserServiceProvider, public oneClickProvider: OneClickProvider) {
  }

  ionViewDidLoad() {
    this.oneClickProvider.getProfile()
    .then(usr => this.user = usr)
    .then(usr => this.eligibilities = this.user.eligibilities)
    .then(usr => this.accommodations = this.user.accommodations)
  }

  updateProfile() {
    this.oneClickProvider.updateProfile()
    .then(usr => this.user = usr)
    .then(usr => this.eligibilities = this.user.eligibilities)
    .then(usr => this.accommodations = this.user.accommodations)
  }

}
