import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { FormControl } from '@angular/forms';

// PROVIDERS
import { GeocodeServiceProvider } from '../../providers/google/geocode-service';
import { GoogleMapsHelpersProvider } from '../../providers/google/google-maps-helpers';
import { AuthProvider } from '../../providers/auth/auth';
import { OneClickProvider } from '../../providers/one-click/one-click';

// PAGES
import { CategoriesFor211Page } from '../211/categories-for211/categories-for211';
import { ServiceFor211DetailPage } from '../211/service-for211-detail/service-for211-detail';

// MODELS
import { OneClickPlaceModel } from "../../models/one-click-place";
import { GooglePlaceModel } from "../../models/google-place";


// COMPONENTS
import { PlaceSearchComponent } from "../../components/place-search/place-search";


@IonicPage()
@Component({
  selector: 'page-user-locator',
  templateUrl: 'user-locator.html',
})
export class UserLocatorPage {
  
  @ViewChild('originSearch') originSearch: PlaceSearchComponent;
  @ViewChild('destinationSearch') destinationSearch: PlaceSearchComponent;

  map: google.maps.Map;
  userLocation: GooglePlaceModel;
  findServicesView: Boolean; // Flag for showing the find svcs view vs. the direct transportation finder view

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public geolocation: Geolocation,
              public geoServiceProvider: GeocodeServiceProvider,
              private googleMapsHelpers: GoogleMapsHelpersProvider,
              public oneClickProvider: OneClickProvider,
              private changeDetector: ChangeDetectorRef,
              private auth: AuthProvider,
              public events: Events
            ) {
              
    this.map = null;
    this.userLocation = null; // The user's device location
    this.findServicesView = this.navParams.data.findServicesView;
    
    this.events.subscribe('place-search:change', () => {
      this.changeDetector.detectChanges();
    });
  }

  ionViewDidLoad() {
        
    // Initialize the map once device is ready
    this.platform.ready()
    .then(() => this.initializeMap())

  }

  // Sets up the google map and geolocation services
  initializeMap() {

    this.map = this.googleMapsHelpers.buildGoogleMap('user-locator-map-canvas');

    // Add a location geolocator button that centers the map and sets the from place
    this.googleMapsHelpers
    .addYourLocationButton(this.map, (latLng) => {
      this.zoomToUserLocation(latLng);
      
      // Clear the search bar and search results
      this.originSearch.searchControl.setValue("", {emitEvent: false});
      
      // Clear the origin search location so it can be replaced by the user location
      this.originSearch.place = null;

    });

    // Try to automatically geolocate, centering the map and setting the from place
    this.geolocation.getCurrentPosition()
    .then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.zoomToUserLocation(latLng);
    })
    .catch((err) => {
      console.error("Could not geolocate device position");
    });

  }
  
  // Updates the userLocation, and centers the map at the given latlng
  zoomToUserLocation(latLng: google.maps.LatLng) {
    this.setUserPlaceFromLatLng(latLng.lat(), latLng.lng());
    this.map.setCenter(latLng);
    this.googleMapsHelpers.dropUserLocationPin(this.map, latLng);
  }

  // Goes on to the categories/services page, using the given location as the center point
  searchForServices(place: GooglePlaceModel){
    console.log("SEARCHING FOR SERVICES", place);
    this.storePlaceInSession(place);
    this.navCtrl.push(CategoriesFor211Page);
  }
  
  // Plans a trip based on origin and destination
  findTransportation(origin: GooglePlaceModel, 
                     destination: GooglePlaceModel) {
    this.navCtrl.push(ServiceFor211DetailPage, {
      service: null,
      origin: origin,
      destination: destination
    });

  }

  // After device geolocation, update the userLocation property
  private setUserPlaceFromLatLng(lat: number, lng: number) : void{
    this.geoServiceProvider.getPlaceFromLatLng(lat, lng)
    .subscribe( (places) => { 
      this.userLocation = places[0];
      this.originSearch.placeholder = "Your Location: " + this.userLocation.formatted_address;
      
      // Set the origin to the user location if it isn't already set
      this.originSearch.place = this.originSearch.place || this.userLocation; 
    });
  }
  
  // Centers map on a place
  private centerMapOnPlace(place: GooglePlaceModel) {
    let latLng = new google.maps.LatLng(place.geometry.lat, place.geometry.lng);
    this.map.setCenter(latLng);
  }

  // Store place in session hash
  private storePlaceInSession(place: GooglePlaceModel) {
    let session = this.auth.session();
    session.user_starting_location = place;
    this.auth.setSession(session);
  }
  
}
