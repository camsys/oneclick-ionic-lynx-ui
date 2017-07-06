import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {CategoryFor211Model} from '../../../models/category-for-211';
import {SubcategoryFor211Model} from '../../../models/subcategory-for-211'

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


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.category = navParams.data.selected_category;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubcategoriesFor211Page');
  }

}
