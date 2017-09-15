import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, Platform, NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { FormControl } from '@angular/forms';

import { GeocodeServiceProvider } from '../../providers/google/geocode-service';
import { GoogleMapsHelpersProvider } from '../../providers/google/google-maps-helpers';
import { AuthProvider } from '../../providers/auth/auth';

import { LocationAutoCompletePage } from '../location-auto-complete/location-auto-complete';
import { CategoriesFor211Page } from '../211/categories-for211/categories-for211';
import { OneClickProvider } from '../../providers/one-click/one-click';

import { environment } from '../../app/environment';
import { PlaceModel } from "../../models/place";
import { Session } from '../../models/session';

/**
 * Generated class for the UserLocatorPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-locator',
  templateUrl: 'user-locator.html',
})
export class UserLocatorPage {

  map: google.maps.Map;
  userLocation: PlaceModel;
  
  // Places search/autocomplete
  searchControl: FormControl;  
  addressQuery: string;
  autocompleteItems: PlaceModel[];
  googleAutocompleteItems: PlaceModel[];
  oneClickAutocompleteItems: PlaceModel[];
  // 
  // 
  // autocompleteItems;
  // googleAutoCompleteService = new google.maps.places.AutocompleteService();
  // googleAutocompleteItems;
  // oneClickAutocompleteItems;

  constructor(public navCtrl: NavController,
              public modalController: ModalController,
              public platform: Platform,
              public geolocation: Geolocation,
              public geoServiceProvider: GeocodeServiceProvider,
              private googleMapsHelpers: GoogleMapsHelpersProvider,
              public oneClickProvider: OneClickProvider,
              private changeDetector: ChangeDetectorRef,
              private auth: AuthProvider
            ) {
    this.map = null;
    this.userLocation = null; // The user's device location
    
    // For handling search autocomplete
    this.searchControl = new FormControl();
    this.addressQuery = '';
    this.googleAutocompleteItems = [];
    this.oneClickAutocompleteItems = [];
    this.autocompleteItems = [];
  }

  ionViewDidLoad() {
    
    // Initialize the map once device is ready
    this.platform.ready()
    .then(() => this.initializeMap())
    
    // Search for items based on user search terms
    // Use an observable, canceling previous requests unless user pauses for half a second
    this.searchControl.valueChanges
                      .debounceTime(500)
                      .subscribe((query) => {
      this.updateAddressSearch(query);
    });
  }

  // Sets up the google map and geolocation services
  initializeMap() {

    this.map = this.googleMapsHelpers.buildGoogleMap('user-locator-map-canvas');

    // Add a location geolocator button that centers the map and sets the from place
    this.googleMapsHelpers
    .addYourLocationButton(this.map, (latLng) => {
      this.updatePlaceFromLatLng(latLng.lat(), latLng.lng());
    });

    // Try to automatically geolocate, centering the map and setting the from place
    this.geolocation.getCurrentPosition()
    .then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.setCenter(latLng);
      this.updatePlaceFromLatLng(latLng.lat(), latLng.lng());
      this.dropUserLocationPin(latLng);
    })
    .catch((err) => {
      console.error("Could not geolocate device position");
    });

  }

  dropUserLocationPin(position : google.maps.LatLng){
    let marker : google.maps.Marker = new google.maps.Marker;
    marker.setPosition(position);
    marker.setMap(this.map);
    // marker.setLabel(service.Name_Agency);
    marker.setValues('Your Location');
    marker.setTitle('Your Location');
    marker.setClickable(false);
  }

  searchForServices(place: PlaceModel){
    console.log("SEARCHING FOR SERVICES", place);
    this.storePlaceInSession(place);
    this.navCtrl.push(CategoriesFor211Page);
  }

  // After device geolocation, update the userLocation property
  private updatePlaceFromLatLng(lat: number, lng: number) : void{
    this.geoServiceProvider.getPlaceFromLatLng(lat, lng)
    .subscribe(places => {
      // Update the place only if it hasn't been set yet.
      this.userLocation = places[0]
    });
  }

  // Select an item from the search results list
  chooseItem(item: any) {
    this.geoServiceProvider.getPlaceFromFormattedAddress(item.formatted_address)
    .subscribe(places => {
      this.searchForServices(places[0]);
    });
  }
  
  // Updates the search items list based on the response from OneClick and Google
  updateAddressSearch(query) {
    if(query === '') {
      this.autocompleteItems = [];
      return;
    }
    
    this.oneClickProvider
    .getPlaces(query)
    .subscribe(places => {
      // Set oneClickAutocompleteItems to the places call results and refresh the search results
      this.oneClickAutocompleteItems = places;
      this.refreshSearchResults();
    });

    this.geoServiceProvider
    .getGooglePlaces(query)
    .subscribe(places => {
      // Set googleAutocompleteItems to the places call results and refresh the search results
      this.googleAutocompleteItems = places;
      this.refreshSearchResults();
    });
    
  }
  
  // Refreshes the search results from the combined Google and OneClick search results,
  private refreshSearchResults() {
    // Set autocomplete results to the combination of the google and oneclick place searches
    this.autocompleteItems = this.googleAutocompleteItems.concat(this.oneClickAutocompleteItems);
    
    // Manually force component refresh
    this.changeDetector.detectChanges();
  }
  
  // Centers map on a place
  private centerMapOnPlace(place: PlaceModel) {
    let latLng = new google.maps.LatLng(place.geometry.lat, place.geometry.lng);
    this.map.setCenter(latLng);
  }

  // Store place in session hash
  private storePlaceInSession(place: PlaceModel) {
    let session = this.auth.session();
    session.user_starting_location = place;
    this.auth.setSession(session);
  }

}
