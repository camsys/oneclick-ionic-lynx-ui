import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ServicesMapTabPage } from '../services-map-tab/services-map-tab';
import { ServicesListTabPage } from '../services-list-tab/services-list-tab';
import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail';

// import { ReferNet211ServiceProvider } from '../../../providers/refer-net211-service/refer-net211-service';
import { SubSubcategoryFor211Model } from '../../../models/sub-subcategory-for-211';
import { ServiceModel } from '../../../models/service';
import { OneClickProvider } from '../../../providers/one-click/one-click';

import { AuthProvider } from '../../../providers/auth/auth';


/**
 * Generated class for the ServicesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
})
export class ServicesPage {
  subSubCategory: SubSubcategoryFor211Model;
  services: ServiceModel[] = [];

  mapTab: any;
  listTab: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              private auth: AuthProvider,
              private oneClick: OneClickProvider,
              private app: App) {
    this.subSubCategory = JSON.parse(navParams.data.sub_sub_category);
    this.mapTab = ServicesMapTabPage;
    this.listTab = ServicesListTabPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
    this.events.publish('spinner:show'); // Show spinner while results are loading
    let userLocation = this.auth.userLocation();
    
    this.oneClick
    .getServicesFromSubSubCategoryName(this.subSubCategory.code, userLocation.lat(), userLocation.lng())
    .then((svcs) => {
      this.events.publish('spinner:hide'); // Hide spinner once results come back
      this.services = svcs;
    });
  }
  
  ionViewWillEnter() {
    // Watch for service:selected events from child tabs
    this.events.subscribe('service:selected', (service) => {
      this.onServiceSelected(service);
    })
  }
  
  ionViewWillLeave() {
    // on leaving the page, unsubscribe from the service:selected event to avoid
    // destroyed view errors
    this.events.unsubscribe('service:selected');
  }
  
  // When a service selected event is fired in one of the child tabs,
  // open the transportation options page, passing along the service, an origin, and a destination
  onServiceSelected(service: ServiceModel) {
    // Insert the new page underneat the tabs pages, and then pop the tabs pages off the stack
    this.navCtrl.insert(this.navCtrl.length() - 1, ServiceFor211DetailPage, {
      service: service,
      origin: this.auth.userLocation(),
      destination: {
        name: service.site_name,
        geometry: { location: { lat: service.lat, lng: service.lng} }
      }
    }).then(() => this.navCtrl.pop());
  }
}
