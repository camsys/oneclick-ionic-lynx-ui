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
    this.initializeMap();
  }
  
  // Sets up the google map
  initializeMap() {

    this.map = this.googleMapsHelpers.buildGoogleMap('directions-route-map-canvas');
    
    // Create and draw the routeline
    let routePoints = google.maps.geometry.encoding
                      .decodePath(this.trip.itineraries[0].legs[0].legGeometry.points); // Convert the trip data into an array of google latlngs
    let routeLine = this.googleMapsHelpers.drawRouteLine(routePoints); // Build the route line object
    routeLine.setMap(this.map); // Draw the route line on the map
    this.googleMapsHelpers.zoomToObject(this.map, routeLine); // Zoom the map extent to the route line
    
    // Set the start and end markers
    let startMarker = new google.maps.Marker({
      position: routePoints[0],
      label: 'A',
      map: this.map
    });
    
    let endMarker = new google.maps.Marker({
      position: routePoints[routePoints.length - 1],
      label: 'B',
      map: this.map
    });
    
  }

}
