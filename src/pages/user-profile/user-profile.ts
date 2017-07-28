import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user/user-service'
import {User} from '../../models/user';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public userServiceProvider: UserServiceProvider, public oneClickProvider: OneClickProvider) {
  }

  ionViewDidLoad() {
  	//this.userServiceProvider.getUser().then(incoming_user => this.user = incoming_user);
  	//this.user = 
    this.oneClickProvider.getProfile()
    .then(usr => this.user = usr);
  	//console.log(this.user.firstName);
    console.log('ionViewDidLoad UserProfilePage');
  }

}
