import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { SubcategoriesFor211Page } from '../subcategories-for211/subcategories-for211';
import { SubSubcategoriesFor211Page } from '../sub-subcategories-for211/sub-subcategories-for211';
import { ServicesPage } from '../services/services';
import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail';


// import { ReferNet211ServiceProvider } from '../../../providers/refer-net211-service/refer-net211-service';
import { OneClickProvider } from '../../../providers/one-click/one-click';
import { CategoryFor211Model } from '../../../models/category-for-211';
import { SearchResultModel } from '../../../models/search-result';

import { AuthProvider } from '../../../providers/auth/auth';


/**
 * Generated class for the CategoriesFor211Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-categories-for211',
  templateUrl: 'categories-for211.html',
})
export class CategoriesFor211Page {
  
  categories: CategoryFor211Model[];
  searchControl: FormControl;
  searchResults: SearchResultModel[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClickProvider: OneClickProvider,
              public events: Events,
              private auth: AuthProvider) {
    
    this.searchResults = [];
    this.searchControl = new FormControl;
    this.searchControl.valueChanges
                      .debounceTime(500)
                      .subscribe((query) => {
      this.updateKeywordSearch(query);
    });              
  }

  getCategories(): void {
    let userLocation = this.auth.userLocation();
    let latlng = userLocation.geometry || {};
    this.oneClickProvider
        .getCategoriesFor211Services(latlng['lat'], latlng['lng'])
        .then(categories => this.categories = categories);
  }

  ionViewDidLoad() {
    this.getCategories();
  }

  openToSubcategory(category: CategoryFor211Model){
    this.navCtrl.push(SubcategoriesFor211Page, {selected_category: category});
  }
  
  // Updates the search results based on a query string.
  updateKeywordSearch(query: string) {
    if(query) {
      this.oneClickProvider.refernetKeywordSearch(query)
          .subscribe((results) => {
            this.searchResults = results;
          });
    } else { // If query is empty, clear the results.
      this.searchResults = [];
    }
  }
  
  // Go to the appropriate page based on the type of the result
  goToSearchResult(result: SearchResultModel) {
    switch(result.type) {
      case "OneclickRefernet::Category":
        this.navCtrl.push(SubcategoriesFor211Page, {selected_category: result.result });
        break;
      case "OneclickRefernet::SubCategory":
        this.navCtrl.push(SubSubcategoriesFor211Page, {selected_subcategory: result.result });
        break;
      case "OneclickRefernet::SubSubCategory":
        let ssc = result.result;
        let userLocation = this.auth.userLocation();
        let latlng = userLocation.geometry || {};
        this.events.publish('spinner:show'); // Show spinner while results are loading

        this.oneClickProvider
        .getServicesFromSubSubCategoryName(ssc.name, latlng['lat'], latlng['lng'])
        .then((value) => {
          this.events.publish('spinner:hide'); // Hide spinner once results come back
          this.navCtrl.push(ServicesPage, {
              selected_sub_subcategory: ssc,
              matches_result: value
            });
          }
        );
        break;
      case "OneclickRefernet::Service":
        let service = result.result;
      
        this.navCtrl.push(ServiceFor211DetailPage, {
          service: service,
          origin: this.auth.session().user_starting_location,
          destination: {
            name: service.site_name,
            geometry: {lat: service.lat, lng: service.lng}
          }
        });
        break;
      default:
        // If result can't link to a page, just clear the results
        this.searchResults = [];
    }
  }

}
