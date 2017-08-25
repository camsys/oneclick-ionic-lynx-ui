import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SubSubCategoriesFor211Page } from '../sub-sub-categories-for211/sub-sub-categories-for211'

import { ReferNet211ServiceProvider } from '../../../providers/refer-net211-service/refer-net211-service';
import { SubcategoryFor211Model } from '../../../models/subcategory-for-211'
import { SubcategoryLinkFor211Model } from '../../../models/subcategory-link-for-211'
import { MatchListFor211Model } from '../../../models/match-list-for-211'

/**
 * Generated class for the SubcategoryLinksFor211Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-subcategory-links-for211',
  templateUrl: 'subcategory-links-for211.html',
})
export class SubcategoryLinksFor211Page {
  subcategory: SubcategoryFor211Model;
  subcategoryLinks: SubcategoryLinkFor211Model[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private referNet211ServiceProvider: ReferNet211ServiceProvider)
  {
    this.subcategory = navParams.data.selected_subcategory;
  }

  // getSubcategoryServices(): void {
  //   this.referNet211ServiceProvider.getSubcategoryLinkForSubcategoryId(this.subcategory.name).
  //   then(slinks => this.subcategoryLinks = slinks);
  // }

  getMatchLists(subCategoryLinkName : string): MatchListFor211Model[]{
    let matches : MatchListFor211Model[] = [];

    this.referNet211ServiceProvider.getMatchListForSubcategoryLinkNameAndCountyCode(subCategoryLinkName, 123).
    then(value => matches = value);

    return matches;
  }

  ionViewDidLoad() {
    // this.getSubcategoryServices();
  }

  openToMatchList(subCategoryLink: SubcategoryLinkFor211Model){
    this.referNet211ServiceProvider.getMatchListForSubcategoryLinkNameAndCountyCode(subCategoryLink.name, 123).
    then(value => this.navCtrl.push(SubSubCategoriesFor211Page, {
        selected_subcategory_link: subCategoryLink,
        matches_result: value
      })
    );
  }

}


