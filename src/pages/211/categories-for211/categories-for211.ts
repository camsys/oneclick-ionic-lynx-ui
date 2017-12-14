import { Component, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { SubcategoriesFor211Page } from '../subcategories-for211/subcategories-for211';
import { SubSubcategoriesFor211Page } from '../sub-subcategories-for211/sub-subcategories-for211';
import { ServicesPage } from '../services/services';
import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail';

import { AutocompleteResultsComponent } from "../../../components/autocomplete-results/autocomplete-results";

// import { ReferNet211ServiceProvider } from '../../../providers/refer-net211-service/refer-net211-service';
import { OneClickProvider } from '../../../providers/one-click/one-click';
import { CategoryFor211Model } from '../../../models/category-for-211';
import { SearchResultModel } from '../../../models/search-result';

import { AuthProvider } from '../../../providers/auth/auth';
import { TranslateService } from '@ngx-translate/core';

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
  
  @ViewChild('searchResultsList') searchResultsList: AutocompleteResultsComponent;
  
  categories: CategoryFor211Model[];
  searchControl: FormControl;
  searchResults: SearchResultModel[];
  
  @HostListener('keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if(event.code === "ArrowDown") {
      this.searchResultsList.focus(); // Focus on search results list when you arrow down from the input field
    }
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClickProvider: OneClickProvider,
              public events: Events,
              private auth: AuthProvider,
              private changeDetector: ChangeDetectorRef,
              private translate: TranslateService) {
    
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
    this.oneClickProvider
        .getCategoriesFor211Services(userLocation.lat(), userLocation.lng())
        .then(categories => this.categories = categories);
  }

  ionViewDidLoad() {
    this.getCategories();
  }

  openToSubcategory(category: CategoryFor211Model){
    this.navCtrl.push(SubcategoriesFor211Page, { category: JSON.stringify(category) } );
  }
  
  // Updates the search results based on a query string.
  updateKeywordSearch(query: string) {
    if(query) {
      this.oneClickProvider.refernetKeywordSearch(query)
          .subscribe((results) => {
            this.searchResults = results.map((r) => this.translateSearchResult(r));
            if(this.searchResults.length === 0) {
              this.searchResults = [ this.emptySearchResult() ];
            }
            this.changeDetector.detectChanges();
          });
    } else { // If query is empty, clear the results.
      this.searchResults = [];
      this.changeDetector.detectChanges();
    }
  }
  
  // Go to the appropriate page based on the type of the result
  goToSearchResult(result: SearchResultModel) {
    switch(result.type) {
      case "OneclickRefernet::Category":
        this.navCtrl.push(SubcategoriesFor211Page, { category: JSON.stringify(result.result) } );
        break;
      case "OneclickRefernet::SubCategory":
        this.navCtrl.push(SubSubcategoriesFor211Page, { sub_category: JSON.stringify(result.result) } );
        break;
      case "OneclickRefernet::SubSubCategory":
        let ssc = result.result;
        // let userLocation = this.auth.userLocation();
        this.navCtrl.push(ServicesPage, { sub_sub_category: JSON.stringify(result.result) });

        // this.events.publish('spinner:show'); // Show spinner while results are loading


        // this.oneClickProvider
        // .getServicesFromSubSubCategoryName(ssc.code, userLocation.lat(), userLocation.lng())
        // .then((value) => {
        //   this.events.publish('spinner:hide'); // Hide spinner once results come back
        //   this.navCtrl.push(ServicesPage, ssc);
        //   }
        // );
        break;
      case "OneclickRefernet::Service":
        let service = result.result;
        // service.url = null;
      
        this.navCtrl.push(ServiceFor211DetailPage, {
          service: JSON.stringify(service),
          origin: JSON.stringify(this.auth.userLocation()),
          destination: JSON.stringify({
            name: service.site_name,
            geometry: { location: { lat: service.lat, lng: service.lng } }
          })
        });
        break;
      default:
        // If result can't link to a page, just clear the results
        this.searchResults = [];
        this.changeDetector.detectChanges();
    }
  }
  
  // Returns the appropriate translation key for OneClick Refernet model class names
  translationKeyFor(name: string) {
    return {
      "OneclickRefernet::Category": "category",
      "OneclickRefernet::SubCategory": "sub_category",
      "OneclickRefernet::SubSubCategory": "sub_sub_category",
      "OneclickRefernet::Service": "service"
    }[name];
  }
  
  // Builds a translated title for a search result
  translateSearchResult(result: SearchResultModel): SearchResultModel {
    let tkey = "lynx.pages.categories.resources_search." + this.translationKeyFor(result.type);
    result.title = this.translate.instant(tkey);
    return result;
  }
  
  // Returns a translated message for empty search results
  emptySearchResult(): SearchResultModel {
    return { label: this.translate.instant('lynx.pages.categories.resources_search.empty_search_result') } as SearchResultModel;
  }

}
