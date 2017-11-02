import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { MapFor211ServicesPage } from '../map-for211-services/map-for211-services';
import { ServicesFromMatchListPage } from '../services-from-match-list/services-from-match-list';
import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail';

// import { ReferNet211ServiceProvider } from '../../../providers/refer-net211-service/refer-net211-service';
import { SubSubcategoryFor211Model } from '../../../models/sub-subcategory-for-211';
import { ServiceModel } from '../../../models/service';

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
  matches_result: ServiceModel[];

  mapTab: any;
  servicesFromMatchListTab: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              private auth: AuthProvider) {
    this.subSubCategory = navParams.data.selected_sub_subcategory;
    this.matches_result = navParams.data.matches_result;
    this.mapTab = MapFor211ServicesPage;
    this.servicesFromMatchListTab = ServicesFromMatchListPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
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
    this.navCtrl.push(ServiceFor211DetailPage, {
      service: service,
      origin: this.auth.session().user_starting_location,
      destination: {
        formatted_address: service.site_name,
        geometry: {lat: service.lat, lng: service.lng}
      }
    })
  }
}
