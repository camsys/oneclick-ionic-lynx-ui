import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { GeocodeServiceProvider } from '../../providers/google/geocode-service';
import { GoogleMapsHelpersProvider } from '../../providers/google/google-maps-helpers';

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
  fromPlace: PlaceModel;
  fromPlaceAddress: string;

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }


  // From autocomplete page
  autocompleteItems;
  autocomplete;
  googleAutoCompleteService = new google.maps.places.AutocompleteService();
  googleAutocompleteItems;
  oneClickAutocompleteItems;

  constructor(public navCtrl: NavController,
              public modalController: ModalController,
              public platform: Platform,
              public geolocation: Geolocation,
              public geoServiceProvider: GeocodeServiceProvider,
              private googleMapsHelpers: GoogleMapsHelpersProvider,
              public oneClickProvider: OneClickProvider //,
              // public viewCtl: ViewController,
              // public navParams: NavParams,
            ) {
    this.map = null;
    this.fromPlace = null;
    this.fromPlaceAddress = '';

    // From autocomplete page
    this.googleAutocompleteItems = [];
    this.oneClickAutocompleteItems = [];
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ionViewDidLoad() {
    this.platform.ready()
    .then(() => this.initializeMap());
  }

  // Is called whenever user inputs into location search bar
  onInput(event: any) {
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

  searchForServices(){
    let session = this.session() || new Session;

    session.user_starting_location = this.fromPlace;
    localStorage.setItem('session', JSON.stringify(session));
    this.navCtrl.push(CategoriesFor211Page);
  }

  private updatePlaceFromLatLng(lat: number, lng: number) : void{
    this.geoServiceProvider.getPlaceFromLatLng(lat, lng).forEach(places => {
      let place = places[0];

      this.fromPlace = place;
      this.fromPlaceAddress = this.fromPlace.formatted_address;
    });
  }

  private updatePlaceFromFormattedAddress(place: PlaceModel) : void{
    this.geoServiceProvider.getPlaceFromFormattedAddress(place).forEach(places => {
      let place = places[0];
      this.fromPlace = place;
      this.fromPlaceAddress = place.formatted_address;
      let latLng = new google.maps.LatLng(place.geometry.lat, place.geometry.lng);
      this.map.setCenter(latLng);
    });
  }

  // *****************
  // AUTOCOMPLETE INFO
  // *****************

  chooseItem(item: any) {
    this.updatePlaceFromFormattedAddress(item);
    this.autocomplete.query = item.formatted_address;
    this.autocompleteItems = [];
  }

  updateSearch() {

    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }

    this.autocompleteItems = [];

    this.oneClickProvider
    .getPlaces(this.autocomplete.query)
    .forEach(places => {
      for(let place of places){
        if(!this.AlreadyPresentPlace(place))
        {
          this.autocompleteItems.push(place);
        }
      }
    });

    this.geoServiceProvider
    .getGooglePlaces(this.autocomplete.query)
    .forEach(places => {
      for(let place of places){
        if(!this.AlreadyPresentPlace(place))
        {
          this.autocompleteItems.push(place);
        }
      }
    });
  }

  AlreadyPresentPlace(place: PlaceModel): boolean
  {
    //TODO make this smarter
    return false;
  }

}
