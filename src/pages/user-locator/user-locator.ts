import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';

// PROVIDERS
import { GeocodeServiceProvider } from '../../providers/google/geocode-service';
import { GoogleMapsHelpersProvider } from '../../providers/google/google-maps-helpers';
import { AuthProvider } from '../../providers/auth/auth';

// PAGES
import { CategoriesFor211Page } from '../211/categories-for211/categories-for211';
import { ServiceFor211DetailPage } from '../211/service-for211-detail/service-for211-detail';

// MODELS
import { GooglePlaceModel } from "../../models/google-place";


// COMPONENTS
import { PlaceSearchComponent } from "../../components/place-search/place-search";
import { AutocompleteResultsComponent } from "../../components/autocomplete-results/autocomplete-results";

@IonicPage()
@Component({
  selector: 'page-user-locator',
  templateUrl: 'user-locator.html',
})
export class UserLocatorPage {

  @ViewChild('originSearch') originSearch: PlaceSearchComponent;
  @ViewChild('destinationSearch') destinationSearch: PlaceSearchComponent;

  @ViewChild('originResults') originResults: AutocompleteResultsComponent;
  @ViewChild('destinationResults') destinationResults: AutocompleteResultsComponent;

  map: google.maps.Map;
  userLocation: GooglePlaceModel;
  viewType: string; // Flag for showing the find svcs view vs. the direct transportation finder view. Can be set to 'services' or 'transportation'
  originMarker: google.maps.Marker;
  destinationMarker: google.maps.Marker;
  imageForDestinationMarker: string;
  selectedOriginItem: number = null;
  lastClicked: string; // used for the map clicking logic
  //myLatLng: google.maps.LatLng = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public geolocation: Geolocation,
              public geoServiceProvider: GeocodeServiceProvider,
              private googleMapsHelpers: GoogleMapsHelpersProvider,
              private changeDetector: ChangeDetectorRef,
              private auth: AuthProvider,
              public events: Events,
              private translate: TranslateService
            ) {

    this.map = null;
    this.lastClicked = null;
    this.userLocation = null; // The user's device location
    this.viewType = this.navParams.data.viewType; // Find services vs. transportation view

    this.events.subscribe('place-search:change', () => {
      this.changeDetector.markForCheck();
    });
  }

  ionViewDidEnter() {
    // Initialize the map once device is ready
    this.platform.ready()
    .then(() => this.initializeMap());
  }

  ionViewWillLeave() {
    // on leaving the page, unsubscribe from the place-search events to avoid
    // detecting changes on destroyed views
    this.events.unsubscribe('place-search:change');
    this.events.unsubscribe('place-search:keypress');
  }

  // Sets up the google map and geolocation services
  initializeMap() {
    this.map = this.googleMapsHelpers.buildGoogleMap('user-locator-map-canvas');


    this.setMapClickListener()

    // Add a location geolocator button that centers the map and sets the from place
    this.googleMapsHelpers
    .addYourLocationButton(this.map, (latLng) => {
      this.zoomToOriginLocation(latLng);

      // Clear the search bar and search results
      this.originSearch.searchControl.setValue("", {emitEvent: false});

      // Clear the origin search location so it can be replaced by the user location
      this.originSearch.place = null;

    });

    // Try to automatically geolocate, centering the map and setting the from place
    this.geolocation.getCurrentPosition()
    .then((position) => {
      // Only zoom to location if another location isn't set yet
      if(!this.userLocation) {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.zoomToOriginLocation(latLng);
        this.setUserPlaceFromLatLng(latLng);
      }
    })
    .catch((err) => {
      console.error("Could not geolocate device position");
    });

  }

  // Updates the userLocation, and centers the map at the given latlng
  zoomToOriginLocation(latLng: google.maps.LatLng) {
    if (this.originMarker != undefined && this.originMarker.getMap() != null) {
      this.originMarker.setMap(null);
    }
    
    this.originMarker = this.googleMapsHelpers.dropUserLocationPin(this.map, latLng);
    this.originMarker.setLabel('A');
    this.setMapCenter();
  }

  zoomToDestinationLocation(latLng: google.maps.LatLng) {
    if (this.destinationMarker != undefined && this.destinationMarker.getMap() != null) {
      this.destinationMarker.setMap(null);
    }

    this.destinationMarker = this.googleMapsHelpers.dropUserLocationPin(this.map, latLng);
    this.destinationMarker.setIcon(this.imageForDestinationMarker);
    this.destinationMarker.setLabel('B');
    this.setMapCenter();
  }
  
  // Sets map center to origin and/or destination points
  setMapCenter() {
    let pts: google.maps.LatLng[] = [];
    
    if(this.originMarker) {
      pts.push(this.originMarker.getPosition());
    }
    
    if(this.destinationMarker) {
      pts.push(this.destinationMarker.getPosition());
    }
    
    this.googleMapsHelpers.zoomToPoints(this.map, pts);
  }

  // Goes on to the categories/services page, using the given location as the center point
  searchForServices(place: GooglePlaceModel){
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
  private setUserPlaceFromLatLng(latLng: google.maps.LatLng) : void{
    let lat = latLng.lat();
    let lng = latLng.lng();
    
    this.geoServiceProvider.getPlaceFromLatLng(lat, lng)
    .subscribe( (places) => {
      this.userLocation = places[0];
      this.originSearch.placeholder = this.translate.instant("lynx.pages.user_locator.origin_search.placeholder_found") + this.userLocation.formatted_address;

      // Set the origin to the user location if it isn't already set
      this.originSearch.place = this.originSearch.place || this.userLocation;
    });
  }

  // Centers map on a place
  private centerMapOnPlace(place: GooglePlaceModel, originOrDestination: string) {
    place = new GooglePlaceModel(place);
    if(originOrDestination == 'origin') {
      this.zoomToOriginLocation(new google.maps.LatLng(place.lat(), place.lng()));
    } else if(originOrDestination == 'destination') {
      this.zoomToDestinationLocation(new google.maps.LatLng(place.lat(), place.lng()));
    }
  }

  // Store place in session hash
  private storePlaceInSession(place: GooglePlaceModel) {
    let session = this.auth.session();
    session.user_starting_location = place;
    this.auth.setSession(session);
  }


  ////////// Support Clicking the Map ///////////////////////////////////
  // Depending on some logic, assume this click is either setting the Origin or the Destination
  private setPlaceFromClick(latLng: google.maps.LatLng): void{
    if(this.viewType == 'services' || this.originSearch.place == null || this.lastClicked == 'destination')
      this.setOriginFromClick(latLng);
    else
      this.setDestinationFromClick(latLng);
  }

  // Update the Origin from a Map Click
  private setOriginFromClick(latLng: google.maps.LatLng) : void{
    let lat = latLng.lat();
    let lng = latLng.lng();
    
    this.geoServiceProvider.getPlaceFromLatLng(lat, lng)
    .subscribe( (places) => {
      this.userLocation = places[0];
      this.originSearch.searchControl.setValue(this.userLocation.formatted_address);
      this.zoomToOriginLocation(latLng);
      // Set the origin to the user location 
      this.originSearch.place = this.userLocation;
      this.lastClicked = 'origin';
    });
  }

  // Update the Destination from a Map Click
  private setDestinationFromClick(latLng: google.maps.LatLng) : void{
    let lat = latLng.lat();
    let lng = latLng.lng();
    
    this.geoServiceProvider.getPlaceFromLatLng(lat, lng)
    .subscribe( (places) => {
      //this.userLocation = places[0];
      this.destinationSearch.searchControl.setValue(places[0].formatted_address);
      this.zoomToDestinationLocation(latLng);
      // Set the origin to the user location 
      this.destinationSearch.place = places[0];
      this.lastClicked = 'destination';
    });
  }

  // Detect the Click and Grab the LatLng
  private setMapClickListener(){
    let me = this;
    google.maps.event.addDomListener(this.map, 'click', function(event) {
      me.setPlaceFromClick(event.latLng);
    });
  }
  //////////////////////////////////////////////////////////////////////

}
