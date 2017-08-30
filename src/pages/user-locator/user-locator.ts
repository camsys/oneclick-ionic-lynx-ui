import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { GeocodeServiceProvider } from '../../providers/google/geocode-service'

import { LocationAutoCompletePage } from '../location-auto-complete/location-auto-complete'
import { CategoriesFor211Page } from '../211/categories-for211/categories-for211'

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

  constructor(public navCtrl: NavController, public modalController: ModalController, public platform: Platform, public geolocation: Geolocation, public geoServiceProvider: GeocodeServiceProvider) {
    this.map = null;
    this.fromPlace = null;
    this.fromPlaceAddress = '';
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => { this.initializeMap();});
  }

  initializeMap() {
    let minZoomLevel = 10;

    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: minZoomLevel,
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };

      this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
      this.updatePlaceFromLatLng(latLng.lat(), latLng.lng());
    }, (err) => {
      // let latLng = new google.maps.LatLng(28.538336, -81.379234);
      let latLng = new google.maps.LatLng(42.302198,-71.064377);

      let mapOptions = {
        center: latLng,
        zoom: minZoomLevel,
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };

      this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
      this.updatePlaceFromLatLng(latLng.lat(), latLng.lng());
    }).
    then(() => (this.addYourLocationButton()));
  }

  addYourLocationButton() {
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('locationButton');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);


    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);

    if (this.map != null)
    {
      let child_scope = this;
      firstChild.addEventListener('click', function() {

        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            child_scope.map.setCenter(latlng);
            child_scope.updatePlaceFromLatLng(latlng.lat(), latlng.lng());
          });
        }
      });

      var location_button = (<HTMLScriptElement[]><any>controlDiv.getElementsByTagName('locationButton'))[0];
      this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(location_button);
    }
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

    let session = this.session();

    if(session == null)
    {
      session = new Session;
    }

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
}
