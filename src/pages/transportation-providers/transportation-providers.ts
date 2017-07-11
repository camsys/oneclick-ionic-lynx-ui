import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Providers
import { OneClickProvider } from '../../providers/one-click/one-click';

// Models
import { TransportationProviderModel } from '../../models/transportation-provider';


/**
 * Generated class for the TransportationProvidersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-transportation-providers',
  templateUrl: 'transportation-providers.html',
})
export class TransportationProvidersPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private oneClickProvider: OneClickProvider) {}
              
  transportationProviders: TransportationProviderModel[];

  ionViewDidLoad() {    
    this.oneClickProvider.getTransportationProviders()
    .then(tps => this.transportationProviders = tps);
  }
  
  // constructor(public navCtrl: NavController,
  //             public navParams: NavParams,
  //             private referNet211ServiceProvider: ReferNet211ServiceProvider) {}
  // 
  // categories: CategoryFor211Model[];
  // 
  // getParentLevelServices(): void {
  //   this.referNet211ServiceProvider.getCategoriesFor211Services().then(parent_services => this.categories = parent_services);
  // }
  // 
  // ionViewDidLoad() {
  //   this.getParentLevelServices();
  //   console.log('ionViewDidLoad CategoriesFor211Page');
  // }
  // 
  // openToSubcategory(category: CategoryFor211Model){
  //   this.navCtrl.push(SubcategoriesFor211Page, {selected_category: category});
  // }

}
