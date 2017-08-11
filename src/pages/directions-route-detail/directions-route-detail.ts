import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ServiceFor211DetailPage } from '../211/service-for211-detail/service-for211-detail'

/**
 * Generated class for the DirectionsRouteDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-directions-route-detail',
  templateUrl: 'directions-route-detail.html',
})
export class DirectionsRouteDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectionsRouteDetailPage');
  }

  openServiceFor211DetailPage(){
    this.navCtrl.push(ServiceFor211DetailPage);
  }

}
