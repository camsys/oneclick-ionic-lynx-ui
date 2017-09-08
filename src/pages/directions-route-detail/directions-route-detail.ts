import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GeocodeServiceProvider } from '../../providers/google/geocode-service';
import { GoogleMapsHelpersProvider } from '../../providers/google/google-maps-helpers';

import { TripResponseModel } from "../../models/trip-response";

/**
 * Generated class for the DirectionsRouteDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-directions-route-detail',
  templateUrl: 'directions-route-detail.html',
})
export class DirectionsRouteDetailPage {
  trip:TripResponseModel;
  map: google.maps.Map;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public geoServiceProvider: GeocodeServiceProvider,
              private googleMapsHelpers: GoogleMapsHelpersProvider) {
    this.trip = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectionsRouteDetailPage');
    console.log(this.trip);
    this.initializeMap();
  }
  
  // Sets up the google map
  initializeMap() {

    this.map = this.googleMapsHelpers.buildGoogleMap('directions-route-map-canvas');
    
    let routePoints = google.maps.geometry.encoding
                      .decodePath(this.trip.itineraries[0].legs[0].legGeometry.points);
    let routeLine = new google.maps.Polyline({
      path: routePoints,
      strokeColor: '#9A0959',
      strokeOpacity: 0.7,
      strokeWeight: 6
    });
    
    routeLine.setMap(this.map);
    
  }

}
