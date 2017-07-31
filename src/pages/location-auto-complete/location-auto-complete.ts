import { Component} from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { OneClickProvider } from '../../providers/one-click/one-click'
import { GeocodeServiceProvider } from '../../providers/google/geocode-service'
import { PlaceModel } from "../../models/place";

/**
 * Generated class for the LocationAutoCompletePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-location-auto-complete',
  templateUrl: 'location-auto-complete.html',
})
export class LocationAutoCompletePage {
  autocompleteItems;
  autocomplete;
  googleAutoCompleteService = new google.maps.places.AutocompleteService();
  googleAutocompleteItems;
  oneClickAutocompleteItems;


  constructor(public viewCtl: ViewController, public navParams: NavParams,
              public oneClickProvider: OneClickProvider, public googleServiceProvider: GeocodeServiceProvider ) {
    this.googleAutocompleteItems = [];
    this.oneClickAutocompleteItems = [];
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.viewCtl.dismiss();
  }

  chooseItem(item: any) {
    this.viewCtl.dismiss(item);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }

    this.autocompleteItems = [];

    this.oneClickProvider.getPlaces(this.autocomplete.query).forEach(places => {
      for(let place of places){
        if(this.AlreadyPresentPlace(place) === false)
        {
          this.autocompleteItems.push(place);
        }
      }
    });

    this.googleServiceProvider.getGooglePlaces(this.autocomplete.query).forEach(places => {
      for(let place of places){
        if(this.AlreadyPresentPlace(place) === false)
        {
          this.autocompleteItems.push(place);
        }
      }
    });
  }


  ionViewDidLoad() {
  }

  AlreadyPresentPlace(place: PlaceModel): boolean
  {
    //TODO make this smarter
    return false;
  }

}
