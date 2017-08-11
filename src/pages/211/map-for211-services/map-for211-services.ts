import { Component} from '@angular/core';
import { IonicPage, Platform, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { MatchListFor211Model } from '../../../models/match-list-for-211';

import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail';

/**
 * Generated class for the MapFor211ServicesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-map-for211-services',
  templateUrl: 'map-for211-services.html',
})
export class MapFor211ServicesPage {

  //This is needed to dunamically change the div containing the marker's information
  service_map: google.maps.Map;
  matches: MatchListFor211Model[];
  selectedMatch: MatchListFor211Model;
  markerSelected: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public geolocation: Geolocation) {
    this.service_map = null;
    this.matches = navParams.data;
    this.selectedMatch = null;
    this.markerSelected = false;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => { this.initializeMap();});
    // this.markerSelected = true;

  }

  initializeMap(): void {
    let latLng = new google.maps.LatLng(28.538336, -81.379234);
    let mapOptions = {
      center: latLng,
      zoom: 10,
      mapTypeControl: false,
      streetViewControl: false
    };

    this.service_map = new google.maps.Map(document.getElementById('service_map_canvas'), mapOptions);
    let me = this;
    for (let service of this.matches) {

      if( (typeof service.Latitude!='undefined' && service.Latitude) && (typeof service.Longitude!='undefined' && service.Longitude) )
      {
        let service_location : google.maps.LatLng = new google.maps.LatLng (Number(service.Latitude), Number(service.Longitude)*-1);

        let marker : google.maps.Marker = new google.maps.Marker;
        marker.setPosition(service_location);
        marker.setMap(this.service_map);
        // marker.setLabel(service.Name_Agency);
        marker.setValues(service);
        console.log(marker);
        marker.setTitle(service.Name_Agency);
        marker.setClickable(true);
        marker.addListener('click', function() {
          me.addServiceInfo(service);
        });
      }else{
        console.log('There was a service without Lat Long');
        console.log(service);
      }

    }

  }

  addServiceInfo(serviceMatch: MatchListFor211Model){
    this.markerSelected = true;
    this.selectedMatch = serviceMatch;
    console.log(this.selectedMatch);
    console.log('this.marker_selected===='+this.selectedMatch+'====');
  }

  openServicePage(m : MatchListFor211Model){
    this.navCtrl.parent.viewCtrl._nav.push(ServiceFor211DetailPage);
  }
}
