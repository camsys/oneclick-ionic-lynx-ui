import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ServiceFor211DetailPage } from '../211/service-for211-detail/service-for211-detail'


/**
 * Generated class for the DirectTransporationFinderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-direct-transporation-finder',
  templateUrl: 'direct-transporation-finder.html',
})
export class DirectTransporationFinderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectTransporationFinderPage');
  }

  openServiceFor211DetailPage(){
    this.navCtrl.push(ServiceFor211DetailPage);
  }
}
