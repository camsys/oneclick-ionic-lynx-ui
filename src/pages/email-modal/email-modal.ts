import { Component } from '@angular/core';
import { ServiceModel } from "../../models/service";
import { IonicPage, ViewController, NavController, NavParams, ModalController } from 'ionic-angular';
import { OneClickProvider } from '../../providers/one-click/one-click';

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

  constructor(public navParams: NavParams, public viewCtrl: ViewController, public oneClick: OneClickProvider) {
     console.log('UserId', navParams.get('service'));
  }

  cancel() {
    this.oneClick.email211Service("dedwards8@gmail.com",["1"]);
    this.viewCtrl.dismiss(null);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailModalPage');
  }

}
