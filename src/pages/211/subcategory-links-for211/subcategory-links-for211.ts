import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MatchListsFor211Page } from '../match-lists-for211/match-lists-for211'

import { ReferNet211ServiceProvider } from '../../../providers/refer-net211-service/refer-net211-service';
import { SubcategoryFor211Model } from '../../../models/subcategory-for-211'
import { SubcategoryLinkFor211Model } from '../../../models/subcategory-link-for-211'

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

  getSubcategoryServices(): void {
    this.referNet211ServiceProvider.getSubcategoryLinkForSubcategoryId(this.subcategory.Category_ID).
    then(slinks => this.subcategoryLinks = slinks);
  }

  ionViewDidLoad() {
    this.getSubcategoryServices();
  }

  openToMatchList(subCategoryLink: SubcategoryLinkFor211Model){
    this.navCtrl.push(MatchListsFor211Page, {selected_subcategory_link: subCategoryLink});
  }

}


