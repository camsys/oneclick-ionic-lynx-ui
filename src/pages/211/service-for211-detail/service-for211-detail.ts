import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ServiceFor211ReviewPage } from '../service-for211-review/service-for211-review'
import { DirectionsPage } from '../../directions/directions'
import { TransportationEligibilityPage } from '../../transportation-eligibility/transportation-eligibility'
import { ServiceModel } from '../../../models/service'

/**
 * Generated class for the ServiceFor211DetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-for211-detail',
  templateUrl: 'service-for211-detail.html',
})
export class ServiceFor211DetailPage {

  service: ServiceModel;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.service = navParams.data.service;
    console.log(navParams.data.service);

    console.log(navParams);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceFor211DetailPage');
  }

  openServiceReviewPage(){
    this.navCtrl.push(ServiceFor211ReviewPage);
  }

  openDirectionsPage(){
    this.navCtrl.push(DirectionsPage);
  }

  openOtherTransportationOptions(){
    this.navCtrl.push(TransportationEligibilityPage)
  }

}
