import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { ServicesPage } from '../services/services'

import { OneClickProvider } from '../../../providers/one-click/one-click';
import { SubcategoryFor211Model } from '../../../models/subcategory-for-211'
import { SubSubcategoryFor211Model } from '../../../models/sub-subcategory-for-211'

import { AuthProvider } from '../../../providers/auth/auth';


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
  subSubCategories: SubSubcategoryFor211Model[];
  // userStartingLocation: GooglePlaceModel;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClickServiceProvider: OneClickProvider,
              public events: Events,
              private auth: AuthProvider ) {
    this.subcategory = navParams.data.selected_subcategory;
    // this.userStartingLocation = this.auth.session().user_starting_location;
  }

  getSubSubCategories(): void {
    let userLocation = this.auth.userLocation();
    let latlng = userLocation.geometry || {};
    this.oneClickServiceProvider
        .getSubSubcategoryForSubcategoryName(this.subcategory.code, latlng['lat'], latlng['lng'])
        .then(sscs => this.subSubCategories = sscs);
  }

  ionViewDidLoad() {
    this.getSubSubCategories();
  }

  openToMatchList(subSubCategory: SubSubcategoryFor211Model) {
    this.events.publish('spinner:show'); // Show spinner while results are loading
    let userLocation = this.auth.userLocation();
    let latlng = userLocation.geometry || {};

    this.oneClickServiceProvider
    .getServicesFromSubSubCategoryName(subSubCategory.code, latlng['lat'], latlng['lng'])
    .then((value) => {
      this.events.publish('spinner:hide'); // Hide spinner once results come back
      this.navCtrl.push(ServicesPage, {
          selected_sub_subcategory: subSubCategory,
          matches_result: value
        });
      }
    );

  }

}
