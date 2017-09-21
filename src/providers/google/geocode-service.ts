import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { GooglePlaceModel } from "../../models/google-place";
import { AddressComponentModel } from '../../models/address-component';
import { LocationModel } from '../../models/location';

@Injectable()
export class GeocodeServiceProvider {
  googleAutoCompleteService = new google.maps.places.AutocompleteService();
  googleGeoCoder = new google.maps.Geocoder();

  constructor(public http: Http) {
  }

  public getGooglePlaces(address_query: string): Observable<GooglePlaceModel[]>{

    let placesObservable: Observable<GooglePlaceModel[]> = Observable.create(obs => {
      let predictionFormatter = function (predictions, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          // obs.error(status);
          console.error(status);
          obs.next([]);
          obs.complete();
        }
        else {
          let mockedPlaces = [];

          predictions.forEach(function (prediction) {
            let place: GooglePlaceModel = {
              address_components: null,
              geometry: null,
              formatted_address: prediction.description,
              id: null,
              name: null
            };
            mockedPlaces.push(place);
          });

          obs.next(mockedPlaces);
          obs.complete();
        }
      };

      this.googleAutoCompleteService.getPlacePredictions({ input: address_query, componentRestrictions: {country: 'US'} }, predictionFormatter);
    });

    return placesObservable;
  }

  public getPlaceFromLatLng(lat: number, lng: number): Observable<GooglePlaceModel[]>{

    let request = {location:  { lat: lat, lng: lng }};

    return this.geocode(request)
  }
  public getPlaceFromFormattedAddress(place: GooglePlaceModel): Observable<GooglePlaceModel[]>{
    let request = {address: place.formatted_address, componentRestrictions: {country: 'US'} };
    console.log("GETTING PLACE FROM FORMATTED ADDRESS", request)

    return this.geocode(request);
  }

  private geocode(request): Observable<GooglePlaceModel[]>{
    let scope = this;

    let placesObservable: Observable<GooglePlaceModel[]> = Observable.create(obs => {
      let placeFormatter = function (locationResult, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          obs.error(status);
        }
        else {
          let addressGeolocated = [];
          locationResult.forEach( function (location) {
            addressGeolocated.push(scope.buildPlaceModelFromGeoCoderResult(location));
          });

          obs.next(addressGeolocated);
          obs.complete();
        }
      };

      this.googleGeoCoder.geocode(request, placeFormatter);
    });

    return placesObservable;
  }

  private buildPlaceModelFromGeoCoderResult(result: google.maps.GeocoderResult): GooglePlaceModel
  {
    let resultLocation: LocationModel = {lat: result.geometry.location.lat(), lng: result.geometry.location.lng()};

    let place: GooglePlaceModel = {
      address_components: result.address_components as AddressComponentModel[],
      geometry: resultLocation,
      formatted_address: result.formatted_address,
      id: null,
      name: null
    };
    return place;
  }
}
