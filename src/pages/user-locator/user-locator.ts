import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { UserServiceProvider } from '../../providers/user/user-service'

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
  fromValue:string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public geolocation: Geolocation, public userProvider: UserServiceProvider) {
    this.map = null;
    this.fromValue = '';
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => { this.initializeMap();});
    this.platform.ready().then(() => { this.initializeAutocomplete();});

    console.log(this.userProvider.getUser());
    //this.userProvider.setUserLocation('gdsgdsfkljl');
    console.log(this.userProvider.getUser());
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
    }, (err) => {
      let latLng = new google.maps.LatLng(28.538336, -81.379234);

      let mapOptions = {
        center: latLng,
        zoom: minZoomLevel,
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };

      this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    }).then(() => (this.addYourLocationButton()));
  }

  initializeAutocomplete() {
    // get the field
    // let input_from = (<HTMLInputElement>document.getElementById('location_address'));
    //
    // // set the options
    // let options = {
    //   types: [],
    //   componentRestrictions: {country: 'us'}
    // };

    // create the autocomplete on the field
    // let autocomplete1 = new google.maps.places.Autocomplete(input_from, options);

    // // we need to save a reference to this as we lose it in the callbacks
    // let self = this;

    // add the first listener
    // google.maps.event.addListener(autocomplete1, 'place_changed', function() {
    //   let place = autocomplete1.getPlace();
    //   let geometry = place.geometry;
    //   if ((geometry) !== undefined) {
    //
    //     console.log(place.name);
    //
    //     console.log(geometry.location.lng());
    //
    //     console.log(geometry.location.lat());
    //   }
    // });
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

    // google.maps.event.addListener(map, 'dragend', function() {
    //   $('#you_location_img').css('background-position', '0px 0px');
    // });
  //

    //
    if (this.map != null)
    {
      var child_scope_map: google.maps.Map = this.map;
      firstChild.addEventListener('click', function() {

        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            child_scope_map.setCenter(latlng);
          });
        }
      });

      var location_button = (<HTMLScriptElement[]><any>controlDiv.getElementsByTagName('locationButton'))[0];
      this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(location_button);
    }
  }

}
