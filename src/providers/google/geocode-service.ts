import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';

import { PlaceModel } from '../../models/place'
import { AddressComponentModel } from '../../models/addressComponent';
import { LocationModel } from '../../models/location';

@Injectable()
export class GeocodeServiceProvider {
  locationData: any;
  googlemapsGeocodingForLocationApi: string = 'https://maps.googleapis.com/maps/api.geocode/json?address=';
  apikey: string = 'AIzaSyAELZ3K_3wIKhJwkwRjt8l1aCxGOFIQdhY';
  googleAutoCompleteService = new google.maps.places.AutocompleteService();


  constructor(public http: Http) {
    this.locationData = null;
  }

  // public getGooglePlaces(address_query: string): Observable<PlaceModel[]>{
  //
  //   let mockedPlaces: PlaceModel[];
  //   let mockedPlacesObservable: Observable<PlaceModel[]> = new Observable<PlaceModel[]>((subscriber: Subscriber<PlaceModel[]>) => subscriber.next(mockedPlaces));
  //
  //   this.googleAutoCompleteService.getPlacePredictions({ input: address_query, componentRestrictions: {country: 'US'} }, function (predictions, status) {
  //     mockedPlaces = [];
  //
  //     console.log(predictions);
  //     if(predictions != null)
  //     {
  //       predictions.forEach(function (prediction) {
  //         console.log(prediction);
  //         let place : PlaceModel = {address_components: null, geometry: null, formatted_address: prediction.description, id: null, name: null };
  //
  //         mockedPlaces.push(place);
  //       });
  //
  //     }
  //   });
  //
  //   return mockedPlacesObservable
  // }

  public getGooglePlaces(address_query: string){
    this.googleAutoCompleteService.getPlacePredictions({ input: address_query, componentRestrictions: {country: 'US'} }, function (predictions, status) {
      return predictions;
    });
  }

  // getLatLong(address:string ) {
  //   if (this.locationData)
  //   {
  //     return Promise.resolve(this.locationData);
  //   }
  //
  //   return new Promise(resolution => {
  //     this.http.get(encodeURIComponent(this.googlemapsGeocodingForLocationApi)+encodeURIComponent(address)+'&key='+this.apikey)
  //       .map(response => response.json())
  //       .subscribe
  //   })
  // }
  //
  // getPlace(latLng: LocationModel){
  //
  // }

}
