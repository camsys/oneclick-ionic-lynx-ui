import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ServicesPage } from '../services/services'

import { OneClickProvider } from '../../../providers/one-click/one-click';
import { SubcategoryFor211Model } from '../../../models/subcategory-for-211'
import { SubcategoryLinkFor211Model } from '../../../models/subcategory-link-for-211'
import { MatchListFor211Model } from '../../../models/match-list-for-211'


/**
 * Generated class for the SubSubCategoriesFor211Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sub-sub-categories-for211',
  templateUrl: 'sub-sub-categories-for211.html',
})
export class SubSubCategoriesFor211Page {

  subcategory: SubcategoryFor211Model;
  subcategoryLinks: SubcategoryLinkFor211Model[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClickServiceProvider: OneClickProvider) {
    this.subcategory = navParams.data.selected_subcategory;
  }

  getSubcategoryServices(): void {
    this.oneClickServiceProvider.getSubSubcategoryForSubcategoryName(this.subcategory.name).then(slinks => this.subcategoryLinks = slinks);
  }

  getMatchLists(subCategoryLinkName: string): MatchListFor211Model[] {
    let matches: MatchListFor211Model[] = [];

    this.oneClickServiceProvider.getMatchListForSubcategoryLinkNameAndCountyCode(subCategoryLinkName).then(value => matches = value);

    return matches;
  }

  ionViewDidLoad() {
    this.getSubcategoryServices();
  }

  openToMatchList(subCategoryLink: SubcategoryLinkFor211Model) {
    this.oneClickServiceProvider.getMatchListForSubcategoryLinkNameAndCountyCode(subCategoryLink.name).then(value => this.navCtrl.push(ServicesPage, {
        selected_subcategory_link: subCategoryLink,
        matches_result: value
      })
    );

  }
}


