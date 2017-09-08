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
    console.log("INPUT ENTERED", event);
  }

  // Sets up the google map and geolocation services
  initializeMap() {
    
    // Create the Map with default settings
    let minZoomLevel = 10;
    let latLng = new google.maps.LatLng(environment.DEFAULT_LOCATION.lat, environment.DEFAULT_LOCATION.lng);
    let mapOptions = {
      center: latLng,
      zoom: minZoomLevel,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
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
    })
    .catch((err) => {
      console.error("Could not geolocate device position");
    });
    
  }

  showAddressModal() {
    let modal = this.modalController.create(LocationAutoCompletePage);
    modal.onDidDismiss(place => {
      if(place != null)
      {
        //If the place is null we should get an actual place from google.
        if(place.location == null)
        {
          place = this.updatePlaceFromFormattedAddress(place);
        }else{
          this.fromPlace = place;
          this.fromPlaceAddress = this.fromPlace.formatted_address;
        }
      }

    });
    modal.present();
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
    console.log("UPDATING PLACE FORM ADDRESS", place);
    this.geoServiceProvider.getPlaceFromFormattedAddress(place).forEach(places => {
      console.log("FOR EACH PLACE", places);
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
