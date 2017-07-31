import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { MatchListFor211Model } from '../../../models/match-list-for-211'

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

  service_map: google.maps.Map;
  matches: MatchListFor211Model[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public geolocation: Geolocation) {
    this.service_map = null;
    this.matches = navParams.data;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => { this.initializeMap();});

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

    for (let service of this.matches) {

      if( (typeof service.Latitude!='undefined' && service.Latitude) && (typeof service.Longitude!='undefined' && service.Longitude) )
      {
        let service_location : google.maps.LatLng = new google.maps.LatLng (Number(service.Latitude), Number(service.Longitude)*-1);
        console.log('Latitude==='+Number(service.Latitude)+'===='+'|||||||||Longitude====='+service.Longitude+'======');
        console.log(service_location);

        let marker : google.maps.Marker = new google.maps.Marker;
        marker.setPosition(service_location);
        marker.setMap(this.service_map);
        // marker.setLabel(service.Name_Agency);
        marker.setValues(service);
        console.log(marker);
        marker.setTitle(service.Name_Agency);
        marker.setClickable(true);
      }else{
        console.log('There was a service without Lat Long');
        console.log(service);
      }

    }

  }
}
