import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SubcategoryLinksFor211Page } from '../subcategory-links-for211/subcategory-links-for211'

import { ReferNet211ServiceProvider } from '../../../providers/refer-net211-service/refer-net211-service';
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
              private referNet211ServiceProvider: ReferNet211ServiceProvider)
  {
    this.category = navParams.data.selected_category;
  }

  getSubcategoryServices(): void {
    this.referNet211ServiceProvider.getSubcategoryForCategoryName(this.category.Category_Name).
      then(subcategories => this.subcategories = subcategories);
  }

  ionViewDidLoad() {
    this.getSubcategoryServices();
  }

  openToSubcategoryLinks(subcategory: SubcategoryFor211Model){
    this.navCtrl.push(SubcategoryLinksFor211Page, {selected_subcategory: subcategory});
  }

}
