import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ServicesPage } from '../services/services'

import { OneClickProvider } from '../../../providers/one-click/one-click';
import { SubcategoryFor211Model } from '../../../models/subcategory-for-211'
import { SubSubcategoryFor211Model } from '../../../models/sub-subcategory-for-211'
import { ServiceModel } from '../../../models/service'
import { Session } from '../../../models/session'
import { PlaceModel } from "../../../models/place";

/**
 * Generated class for the SubSubCategoriesFor211Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sub-subcategories-for211',
  templateUrl: 'sub-subcategories-for211.html',
})
export class SubSubcategoriesFor211Page {

  subcategory: SubcategoryFor211Model;
  subcategoryLinks: SubSubcategoryFor211Model[];
  userStartingLocation: PlaceModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClickServiceProvider: OneClickProvider) {
    this.subcategory = navParams.data.selected_subcategory;
    this.userStartingLocation = this.session().user_starting_location
  }

  getSubcategoryServices(): void {
    this.oneClickServiceProvider.getSubSubcategoryForSubcategoryName(this.subcategory.name).then(slinks => this.subcategoryLinks = slinks);
  }

  getMatchLists(subCategoryLinkName: string): ServiceModel[] {
    let matches: ServiceModel[] = [];

    if(this.userStartingLocation == null)
    {
      this.oneClickServiceProvider.getServicesFromSubSubcategoryWithoutLatLng(subCategoryLinkName).
      then(value => matches = value);
    }else{
      this.oneClickServiceProvider.getServicesFromSubSubcategoryAndLatLng(subCategoryLinkName, this.userStartingLocation.geometry.lat, this.userStartingLocation.geometry.lng).
      then(value => matches = value);
    }

    return matches;
  }

  ionViewDidLoad() {
    this.getSubcategoryServices();
  }

  openToMatchList(subCategoryLink: SubSubcategoryFor211Model) {

    if(this.userStartingLocation == null)
    {
      this.oneClickServiceProvider.getServicesFromSubSubcategoryWithoutLatLng(subCategoryLink.name).
      then(value => this.navCtrl.push(ServicesPage, {
          selected_subcategory_link: subCategoryLink,
          matches_result: value
        })
      );
    }else{
      this.oneClickServiceProvider.getServicesFromSubSubcategoryAndLatLng(subCategoryLink.name, this.userStartingLocation.geometry.lat, this.userStartingLocation.geometry.lng).
      then(value => this.navCtrl.push(ServicesPage, {
          selected_subcategory_link: subCategoryLink,
          matches_result: value
        })
      );
    }


  }

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }
}


