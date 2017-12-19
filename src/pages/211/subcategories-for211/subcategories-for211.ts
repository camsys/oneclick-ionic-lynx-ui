import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { SubSubcategoriesFor211Page } from '../sub-subcategories-for211/sub-subcategories-for211';
import { HelpMeFindPage } from '../../help-me-find/help-me-find';

// import { ReferNet211ServiceProvider } from '../../../providers/refer-net211-service/refer-net211-service';
import { OneClickProvider } from '../../../providers/one-click/one-click';
import { CategoryFor211Model } from '../../../models/category-for-211'
import { SubcategoryFor211Model } from '../../../models/subcategory-for-211'
import { AuthProvider } from '../../../providers/auth/auth';

/**
 * Generated class for the SubcategoriesFor211Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-subcategories-for211',
  templateUrl: 'subcategories-for211.html',
})
export class SubcategoriesFor211Page {

  code: string;
  category: CategoryFor211Model;
  subcategories: SubcategoryFor211Model[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClick: OneClickProvider,
              private auth: AuthProvider,
              public platform: Platform) {
    this.code = this.navParams.data.code;
    
    // Wait for platform to be ready so proper language is set
    this.platform.ready().then(() => {
      
      // Fetch the subcategories based on the passed category code
      this.getSubcategories(this.code);
      
      // If category object is passed, set it as the category
      if(this.navParams.data.category) {
        this.category = this.navParams.data.category as CategoryFor211Model;
      } else if(this.code) { // Otherwise, get category details based on the code
        this.oneClick.getCategoryByCode(this.code)
            .subscribe(cat => this.category = cat);
      } else { // Or, if necessary nav params not passed, go home.
        this.navCtrl.setRoot(HelpMeFindPage);
      }
      
    })
  }

  getSubcategories(code: string): void {
    let userLocation = this.auth.userLocation();
    this.oneClick
        .getSubcategoryForCategoryName(code, userLocation.lat(), userLocation.lng())
        .then(subcategories => this.subcategories = subcategories);
  }

  openToSubSubCategories(subcategory: SubcategoryFor211Model){
    this.navCtrl.push(SubSubcategoriesFor211Page, { sub_category: subcategory, code: subcategory.code } );
  }

}
