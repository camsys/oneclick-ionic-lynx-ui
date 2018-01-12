import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../app/environment';

/*
  This Provider contains helper methods for dealing with the google maps API.
*/
@Injectable()
export class GoogleMapsHelpersProvider {

  minZoom: number = 10;
  maxZoom: number = 16;

  // Sets up a map element with default options, and returns it
  buildGoogleMap(mapDivId: string): google.maps.Map {
    // Create the Map with default settings
    let latLng = new google.maps.LatLng(environment.DEFAULT_LOCATION.lat, environment.DEFAULT_LOCATION.lng);
    let mapOptions = {
      center: latLng,
      zoom: this.minZoom,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    return new google.maps.Map(document.getElementById(mapDivId), mapOptions);
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

  // Builds a routeline with default formatting, and returns it. Takes an array
  // of google maps latlngs and a string of the leg's mode
  drawRouteLine(routePoints: google.maps.LatLng[],
                mode: string="BUS"): google.maps.Polyline {

    switch(mode) {

      // Dotted Gray Line
      case 'WALK':
        let dotIcon = {
          path: 'M 0,0 0,0',
          strokeColor: '#5C5C5C', // Dark Gray
          strokeOpacity: 1,
          scale: 7
        };

        return new google.maps.Polyline({
          path: routePoints,
          strokeOpacity: 0,
          icons: [{
            icon: dotIcon,
            offset: '0',
            repeat: '12px'
          }],
        });

      // Solid Pink Line
      case 'CAR':
      case 'BUS':
      case 'TRAM':
      case 'SUBWAY':
      case 'BICYCLE':
      default:
        return new google.maps.Polyline({
          path: routePoints,
          strokeColor: '#DB0F7D', // Lynx Dark Pink
          strokeOpacity: 0.7,
          strokeWeight: 6
        });
    }

  }

  // Zooms map view to fit each object in the passed array.
  // Accepts a map and an array of objects to zoom to.
  zoomToObjects(map: google.maps.Map, objs: any[]): void {
    // Map objects to arrays of points, then flatten into a flat array of points
    let points:google.maps.LatLng[] = objs.map((obj):google.maps.LatLng[] => {
      if(obj instanceof google.maps.Polyline) {
        return obj.getPath().getArray();
      } else if(obj instanceof google.maps.Marker) {
        return [obj.getPosition()];
      } else if (obj instanceof google.maps.LatLng) {
        return [obj];
      } else {
        return [];
      }
    }).reduce((acc, cur) => acc.concat(cur), []);

    // Then, zoom the map to the array of points
    this.zoomToPoints(map, points);
  }

  // Zooms the passed map to the minimum box encompassing all of the passed latlngs
  zoomToPoints(map: google.maps.Map, points: google.maps.LatLng[]) {
    var bounds = new google.maps.LatLngBounds();
    points.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds); // fit the map to the bounds
    setTimeout(() => {
      map.setZoom(Math.min(map.getZoom(), this.maxZoom)); // reduce zoom to the max zoom if necessary
    }, 150 );
  }

  // Drops a pin at the given latLng
  dropUserLocationPin(map: google.maps.Map, latLng: google.maps.LatLng):google.maps.Marker {
    let marker = new google.maps.Marker;
    marker.setPosition(latLng);
    marker.setMap(map);
    marker.setValues('Your Location');
    marker.setTitle('Your Location');
    marker.setClickable(false);

    return marker;
  }

}

