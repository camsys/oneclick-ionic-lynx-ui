import { Component, Input, Output, EventEmitter, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Events } from 'ionic-angular';

// MODELS
import { GooglePlaceModel } from "../../models/google-place";
import { AutocompleteItemModel } from "../../models/autocomplete-item";

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
  autocompleteItems: AutocompleteItemModel[];
  googleAutocompleteItems: AutocompleteItemModel[];
  oneClickAutocompleteItems: AutocompleteItemModel[];
  place: GooglePlaceModel;

  @Output() onArrowDown: EventEmitter<any> = new EventEmitter<any>();
  @Output() onBlur: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelect: EventEmitter<GooglePlaceModel> = new EventEmitter<GooglePlaceModel>();
  
  @HostListener('keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if(event.code === "ArrowDown") {
      this.onArrowDown.emit();
    }
  }

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
      this.oneClickAutocompleteItems = places.map((p) => this.convertPlaceToAutocompleteItem(p));
      this.refresh();
    });

    this.geoServiceProvider
    .getGooglePlaces(query)
    .subscribe(places => {
      // Set googleAutocompleteItems to the places call results and refresh the search results
      this.googleAutocompleteItems = places.map((p) => this.convertPlaceToAutocompleteItem(p));
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
    this.place = place;
    this.searchControl.setValue(this.place.formatted_address, {emitEvent: false});
  }

  // Select an item from the search results list
  chooseItem(item: any) {
    this.events.publish('spinner:show'); // Show spinner until geocoding call returns
    
    // Geocode the selected place
    this.geoServiceProvider.getPlaceFromFormattedAddress(item.result)
    .subscribe((places) => {
      this.setPlace(places[0]); // Set the component's place variable to the first result
      this.clear(); // Clear the autocomplete results
      this.events.publish('spinner:hide'); // Hide spinner once places are returned
      this.onSelect.emit(this.place); // Emit the onSelect output event
    });
  }
  
  // Converts a google place model to an autocomplete item model
  convertPlaceToAutocompleteItem(place: GooglePlaceModel): AutocompleteItemModel {
    return {
      title: place.name,
      description: place.formatted_address,
      result: place
    } as AutocompleteItemModel;
  }
  
  // Pass through the ion-search focus and blur events
  ionFocus() {
    this.onFocus.emit();
  }  
  ionBlur() {
    this.onBlur.emit();
  }

}
