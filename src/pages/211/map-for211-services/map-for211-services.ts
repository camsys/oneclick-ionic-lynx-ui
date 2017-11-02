import { Component} from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMapsHelpersProvider } from '../../../providers/google/google-maps-helpers';
import { ServiceModel } from '../../../models/service';

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

  // This is needed to dynamically change the div containing the marker's information
  service_map: google.maps.Map;
  matches: ServiceModel[];
  selectedMatch: ServiceModel;
  markerSelected: boolean;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public geolocation: Geolocation,
              private googleMapsHelpers: GoogleMapsHelpersProvider,
              public events: Events) {
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
    this.service_map = this.googleMapsHelpers.buildGoogleMap('service-results-map-canvas');

    let me = this;

    // Draw service markers, with event handlers that open details window on click
    for (let service of this.matches) {
      if( (typeof service.lat!='undefined' && service.lat) &&
          (typeof service.lng!='undefined' && service.lng) ) {
        let service_location : google.maps.LatLng = new google.maps.LatLng (Number(service.lat), Number(service.lng));

        let marker : google.maps.Marker = new google.maps.Marker;
        marker.setPosition(service_location);
        marker.setMap(this.service_map);
        // marker.setLabel(service.Name_Agency);
        marker.setValues(service);
        marker.setTitle(service.agency_name);
        marker.setClickable(true);
        marker.addListener('click', function() {
          me.addServiceInfo(service);
        });
      } else {
        console.log('There was a service without Lat Long');
        console.log(service);
      }

    }

    // Add event handler for clicking OFF a service marker, closing the details window
    google.maps.event.addListener(this.service_map, "click", function(event) {
      me.markerSelected = false;
      me.selectedMatch = null;
    });

  }

  addServiceInfo(serviceMatch: ServiceModel){
    this.markerSelected = true;
    this.selectedMatch = serviceMatch;
  }

  selectService(match : ServiceModel){
    this.events.publish('service:selected', match);
  }
}
