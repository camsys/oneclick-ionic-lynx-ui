import { Component } from '@angular/core';
import { ServiceModel } from "../../models/service";
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the EmailModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-email-modal',
  templateUrl: 'email-modal.html',
})
export class EmailModalPage {

  constructor(public navParams: NavParams) {
     console.log('UserId', navParams.get('service'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailModalPage');
  }

}
