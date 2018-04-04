import { AddressComponentModel } from './address-component';
import { OneClickPlaceModel } from "./one-click-place";

export class GooglePlaceModel {
  name: string;
  address_components: AddressComponentModel[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number,
      lng: number
    }
  };
  place_id: string;
  types: string[];
  
  constructor(attrs: any) { 
    this.name = (attrs.name || "").replace(/, USA$/, "");
    this.address_components = attrs.address_components || [];
    this.formatted_address = (attrs.formatted_address || "").replace(/, USA$/, "");
    this.geometry = attrs.geometry || {};
    this.place_id = attrs.place_id || null;
    this.types = attrs.types || [];
  }
  
  toOneClickPlace(): OneClickPlaceModel {
    return new OneClickPlaceModel({
      name: this.label(),
      lat: this.lat(),
      lng: this.lng(),
      street_number: this.addressComponent("street_number").long_name,
      route: this.addressComponent("route").long_name,
      city: this.addressComponent("locality").long_name,
      zip: this.addressComponent("postal_code").long_name,
      state: this.addressComponent("administrative_area_level_1").long_name
    })
  }
  
  // Returns the long_name of the first address component with the given type
  addressComponent(type: string) {
    let addrComp = this.address_components
                   .filter((ac) => {
                     // Filter by address_components with the the right type...
                     return ac.types.findIndex((t) => t === type) > -1; 
                   })[0]; // ...and take the first one.
    return addrComp || new AddressComponentModel();
  }
  
  // Returns a label for the place, either from the address components or using the formatted address
  label() {
    return (this.name || 
           this.addressComponent(this.types[0])["long_name"] || 
           this.formatted_address).replace(/, USA$/, "");
  }
  
  // Pulls out the lat, or null if not present
  lat() {
    return this.geometry && this.geometry.location && this.geometry.location.lat;
  }
  
  // Pulls out the lng, or null if not present
  lng() {
    return this.geometry && this.geometry.location && this.geometry.location.lng;
  }
  
  // Returns true/false if item has lat and lng present
  isGeocoded(): Boolean {
    return !!(this.lat() && this.lng());
  }
  
}
