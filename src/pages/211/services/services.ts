import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapFor211ServicesPage } from '../map-for211-services/map-for211-services';
import { ServicesFromMatchListPage } from '../services-from-match-list/services-from-match-list';

// import { ReferNet211ServiceProvider } from '../../../providers/refer-net211-service/refer-net211-service';
import { SubSubcategoryFor211Model } from '../../../models/sub-subcategory-for-211';
import { ServiceModel } from '../../../models/service';


/**
 * Generated class for the ServicesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
})
export class ServicesPage {
  subcategoryLink: SubSubcategoryFor211Model;
  matches_result: ServiceModel[];

  mapTab: any;
  servicesFromMatchListTab: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.subcategoryLink = navParams.data.selected_subcategory_link;
    this.matches_result = navParams.data.matches_result;
    this.mapTab = MapFor211ServicesPage;
    this.servicesFromMatchListTab = ServicesFromMatchListPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
  }
}
