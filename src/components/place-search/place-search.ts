import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Events } from 'ionic-angular';

// MODELS
import { OneClickPlaceModel } from "../../models/one-click-place";
import { GooglePlaceModel } from "../../models/google-place";

// PROVIDERS
import { GeocodeServiceProvider } from '../../providers/google/geocode-service';
import { OneClickProvider } from '../../providers/one-click/one-click';

/**
 * Generated class for the PlaceSearchComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'place-search',
  templateUrl: 'place-search.html'
})
export class PlaceSearchComponent {

  query: string;
  searchControl: FormControl; 
  @Input() placeholder: string;
  autocompleteItems: GooglePlaceModel[];
  googleAutocompleteItems: GooglePlaceModel[];
  oneClickAutocompleteItems: GooglePlaceModel[];
  place: GooglePlaceModel;

  constructor(public geoServiceProvider: GeocodeServiceProvider,
              public oneClickProvider: OneClickProvider,
              public events: Events,
              public changeDetector: ChangeDetectorRef) {
    this.query = '';
    this.searchControl = new FormControl;
    this.placeholder = this.placeholder || "Search";
    this.googleAutocompleteItems = [];
    this.oneClickAutocompleteItems = [];
    this.autocompleteItems = [];
    this.place = null;
    
    this.searchControl.valueChanges
                      .debounceTime(500)
                      .subscribe((query) => {
      this.updateAddressSearch(query);
    });
  }
  
  // Updates the search items list based on the response from OneClick and Google
  updateAddressSearch(query) {
    if(!query || query === '') {
      this.autocompleteItems = [];
      return;
    }
    
    this.oneClickProvider
    .getPlaces(query)
    .subscribe(places => {
      // Set oneClickAutocompleteItems to the places call results and refresh the search results
      this.oneClickAutocompleteItems = places;
      this.refresh();
    });

    this.geoServiceProvider
    .getGooglePlaces(query)
    .subscribe(places => {
      // Set googleAutocompleteItems to the places call results and refresh the search results
      this.googleAutocompleteItems = places;
      this.refresh();
    });
    
  }
  
  // Refreshes the search results from the combined Google and OneClick search results,
  private refresh() {
    // Set autocomplete results to the combination of the google and oneclick place searches
    this.autocompleteItems = this.googleAutocompleteItems.concat(this.oneClickAutocompleteItems);
    this.events.publish('place-search:change');
  }
  
  // Empties the search results array
  clear() {
    this.autocompleteItems = [];
  }
  
  // Sets the place value and fills in the search bar, but doesn't run it as a query
  setPlace(place: GooglePlaceModel) {
    console.log("SETTING PLACE", place);
    this.place = place;
    this.searchControl.setValue(this.place.formatted_address, {emitEvent: false});
  }
  
  // Select an item from the search results list
  chooseItem(item: any) {
    this.events.publish('spinner:show'); // Show spinner until geocoding call returns
    this.geoServiceProvider.getPlaceFromFormattedAddress(item)
    .subscribe((places) => {
      this.setPlace(places[0]);
      this.clear();
      this.events.publish('spinner:hide'); // Hide spinner once places are returned
    });
  }

}
