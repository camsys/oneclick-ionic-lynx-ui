import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform } from 'ionic-angular';

import { ServicesPage } from '../services/services';
import { HelpMeFindPage } from '../../help-me-find/help-me-find';

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

  code: string;
  subcategory: SubcategoryFor211Model;
  subSubCategories: SubSubcategoryFor211Model[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClick: OneClickProvider,
              public events: Events,
              private auth: AuthProvider,
              public platform: Platform) {
                
    this.code = this.navParams.data.code;
    
    // Wait for platform to be ready so proper language is set
    this.platform.ready().then(() => {
      
      // Fetch the subcategories based on the passed category code
      this.getSubSubCategories(this.code);
      
      // If subcategory object is passed, set it as the subcategory
      if(this.navParams.data.subcategory) {
        this.subcategory = this.navParams.data.subcategory as SubcategoryFor211Model;
      } else if(this.code) { // Otherwise, get subcategory details based on the code
        this.oneClick.getSubCategoryByCode(this.code)
            .subscribe(subcat => this.subcategory = subcat);
      } else { // Or, if necessary nav params not passed, go home.
        this.navCtrl.setRoot(HelpMeFindPage);
      }
      
    })
  }

  getSubSubCategories(code: string): void {
    let userLocation = this.auth.userLocation();
    this.oneClick
        .getSubSubcategoryForSubcategoryName(code, userLocation.lat(), userLocation.lng())
        .then(sscs => this.subSubCategories = sscs);
  }

  openToServices(subSubCategory: SubSubcategoryFor211Model) {
    this.navCtrl.push(ServicesPage, { sub_sub_category: subSubCategory, code: subSubCategory.code });
  }

}
