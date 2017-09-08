import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  This Provider contains helper methods for dealing with the google maps API.
*/
@Injectable()
export class GoogleMapsHelpersProvider {

  present(): Boolean {
    return true;
  }
  
  // Adds a your-location button to the map. Takes a map object and a callback
  // function that will accept the latlng of the current position, which is called
  // when that position is found by the geolocator.
  addYourLocationButton(map: any, onClickCallback: Function) {
    let controlDiv = document.createElement('div');
    let locationBoxElement = this.locationBox();
    let reticleElement = this.locationReticle();

    controlDiv.appendChild(locationBoxElement);
    locationBoxElement.appendChild(reticleElement);
  
    if (map != null) {
      locationBoxElement.addEventListener('click', function() {
  
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(latLng);
            onClickCallback(latLng);
          });
        }
      });
  
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationBoxElement);
    }
    
    return locationBoxElement; // Return the location button so that event handlers can be added to it
  }

  // Creates a box for holding the location reticle  
  locationBox() {
    var boxElement = document.createElement('locationButton');
    boxElement.style.backgroundColor = '#fff';
    boxElement.style.border = 'none';
    boxElement.style.outline = 'none';
    boxElement.style.width = '28px';
    boxElement.style.height = '28px';
    boxElement.style.borderRadius = '2px';
    boxElement.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    boxElement.style.cursor = 'pointer';
    boxElement.style.marginRight = '10px';
    boxElement.style.padding = '0px';
    boxElement.title = 'Your Location';
    return boxElement;
  }
  
  // Creates a location reticle icon
  locationReticle() {
    // Location reticle
    var reticleElement = document.createElement('div');
    reticleElement.style.margin = '5px';
    reticleElement.style.width = '18px';
    reticleElement.style.height = '18px';
    reticleElement.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    reticleElement.style.backgroundSize = '180px 18px';
    reticleElement.style.backgroundPosition = '0px 0px';
    reticleElement.style.backgroundRepeat = 'no-repeat';
    reticleElement.id = 'you_location_img';
    return reticleElement;
  }

}
