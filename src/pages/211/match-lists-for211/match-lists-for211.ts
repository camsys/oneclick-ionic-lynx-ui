import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MapFor211ServicesPage } from '../map-for211-services/map-for211-services'
import { ServicesFromMatchListPage } from '../services-from-match-list/services-from-match-list'

// import { ReferNet211ServiceProvider } from '../../../providers/refer-net211-service/refer-net211-service';
import { SubcategoryLinkFor211Model } from '../../../models/subcategory-link-for-211'
import { MatchListFor211Model } from '../../../models/match-list-for-211'

/**
 * Generated class for the MatchListsFor211Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-match-lists-for211',
  templateUrl: 'match-lists-for211.html',
})
export class MatchListsFor211Page {
  subcategoryLink: SubcategoryLinkFor211Model;
  matches_result: MatchListFor211Model[];

  mapTab: any;
  servicesFromMatchListTab: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams)
  {
    this.subcategoryLink = navParams.data.selected_subcategory_link;
    this.matches_result = navParams.data.matches_result;
    this.mapTab = MapFor211ServicesPage;
    this.servicesFromMatchListTab = ServicesFromMatchListPage;
  }

  ionViewDidLoad() {

  }
}
