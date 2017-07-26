import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user/user-service'
import {User} from '../../models/user';


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

  constructor(public navCtrl: NavController, public navParams: NavParams, public userServiceProvider: UserServiceProvider) {
  }

  ionViewDidLoad() {
  	//this.userServiceProvider.getUser().then(incoming_user => this.user = incoming_user);
  	this.user = this.userServiceProvider.getUser();
  	console.log(this.user.firstName);
    console.log('ionViewDidLoad UserProfilePage');
  }

}
