import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMapsHelpersProvider } from '../../../providers/google/google-maps-helpers';
import { ServiceModel } from '../../../models/service';

/**
 * Generated class for the ServicesMapTabPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-services-map-tab',
  templateUrl: 'services-map-tab.html',
})
export class ServicesMapTabPage {

  // This is needed to dynamically change the div containing the marker's information
  service_map: google.maps.Map;
  services: ServiceModel[];
  selectedService: ServiceModel;
  markerSelected: boolean;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public geolocation: Geolocation,
              private googleMapsHelpers: GoogleMapsHelpersProvider,
              public events: Events,
              private changeDetector: ChangeDetectorRef) {
    this.service_map = null;
    this.services = navParams.data;
    this.selectedService = null;
    this.markerSelected = false;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => { this.initializeMap();});
  }

  initializeMap(): void {
    this.service_map = this.googleMapsHelpers.buildGoogleMap('service-results-map-canvas');

    let me = this;

    // Draw service markers, with event handlers that open details window on click    
    let markers = this.services
        .filter((service) => {
          return (typeof service.lat!='undefined' && service.lat) &&
                 (typeof service.lng!='undefined' && service.lng);
        })
        .map((service) => {
          let service_location : google.maps.LatLng = new google.maps.LatLng(Number(service.lat), Number(service.lng));
      
          let marker : google.maps.Marker = new google.maps.Marker;
          marker.setPosition(service_location);
          marker.setMap(this.service_map);
          marker.setValues(service);
          marker.setTitle(service.agency_name);
          marker.setClickable(true);
          marker.addListener('click', function() {
            me.addServiceInfo(service);
          });
          return marker;
        });
    
    // Zoom the map to fit all the services
    this.googleMapsHelpers.zoomToObjects(this.service_map, markers);
    
    // Add event handler for clicking OFF a service marker, closing the details window
    google.maps.event.addListener(this.service_map, "click", function(event) {
      me.markerSelected = false;
      me.selectedService = null;
    });

  }

  addServiceInfo(svc: ServiceModel){
    this.markerSelected = true;
    this.selectedService = svc;
    this.changeDetector.markForCheck();
  }

  selectService(match : ServiceModel){
    this.events.publish('service:selected', match);
  }
}
