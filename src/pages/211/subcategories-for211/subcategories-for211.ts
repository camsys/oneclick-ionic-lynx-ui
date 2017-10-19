import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SubSubcategoriesFor211Page } from '../sub-subcategories-for211/sub-subcategories-for211'

// import { ReferNet211ServiceProvider } from '../../../providers/refer-net211-service/refer-net211-service';
import { OneClickProvider } from '../../../providers/one-click/one-click';
import { CategoryFor211Model } from '../../../models/category-for-211'
import { SubcategoryFor211Model } from '../../../models/subcategory-for-211'

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

  category: CategoryFor211Model;
  subcategories: SubcategoryFor211Model[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClickProvider: OneClickProvider) {
    this.category = navParams.data.selected_category;
  }

  getSubcategories(): void {
    this.oneClickProvider
        .getSubcategoryForCategoryName(this.category.name)
        .then(subcategories => this.subcategories = subcategories);
  }

  ionViewDidLoad() {
    this.getSubcategories();
  }

  openToSubSubCategories(subcategory: SubcategoryFor211Model){
    this.navCtrl.push(SubSubcategoriesFor211Page, {selected_subcategory: subcategory});
  }

}
