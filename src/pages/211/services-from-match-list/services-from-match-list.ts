import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceModel } from '../../../models/service';
import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail';

/**
 * Generated class for the ServicesFromMatchListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-services-from-match-list',
  templateUrl: 'services-from-match-list.html',
})
export class ServicesFromMatchListPage {

  matches: ServiceModel[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.matches = navParams.data;
  }

  ionViewDidLoad() {
  }

  openServicePage(m : ServiceModel){
    this.navCtrl.parent.viewCtrl._nav.push(ServiceFor211DetailPage);
  }
}
