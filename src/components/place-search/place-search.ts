import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Events } from 'ionic-angular';

// MODELS
import { PlaceModel } from "../../models/place";

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
  autocompleteItems: PlaceModel[];
  googleAutocompleteItems: PlaceModel[];
  oneClickAutocompleteItems: PlaceModel[];
  place: PlaceModel;

  constructor(public geoServiceProvider: GeocodeServiceProvider,
              public oneClickProvider: OneClickProvider,
              public events: Events) {
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
      console.log("SUBMITTING QUERY", query);
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
      console.log("ONECLICK RESULTS RETURNED", this.oneClickAutocompleteItems);
      this.refresh();
    });

    this.geoServiceProvider
    .getGooglePlaces(query)
    .subscribe(places => {
      // Set googleAutocompleteItems to the places call results and refresh the search results
      this.googleAutocompleteItems = places;
      console.log("GOOGLE RESULTS RETURNED", this.googleAutocompleteItems);
      this.refresh();
    });
    
  }
  
  // Refreshes the search results from the combined Google and OneClick search results,
  private refresh() {
    // Set autocomplete results to the combination of the google and oneclick place searches
    this.autocompleteItems = this.googleAutocompleteItems.concat(this.oneClickAutocompleteItems);
    console.log("SEARCH RESULTS REFRESHED", this.autocompleteItems);
  }
  
  // Empties the search results array
  clear() {
    this.autocompleteItems = [];
  }
  
  // Select an item from the search results list
  chooseItem(item: any) {
    console.log("ITEM CHOSEN!", item);
    this.events.publish('spinner:show'); // Show spinner until geocoding call returns
    this.geoServiceProvider.getPlaceFromFormattedAddress(item)
    .subscribe((places) => {
      console.log("PLACES RETURNED", places);
      this.place = places[0];
      this.events.publish('spinner:hide'); // Hide spinner once places are returned
    });
  }

}
