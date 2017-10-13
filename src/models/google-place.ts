import { AddressComponentModel } from './address-component';
import { OneClickPlaceModel } from "./one-click-place";

export class GooglePlaceModel {
  address_components: AddressComponentModel[];
  formatted_address: string;
  geometry: {
    lat: number,
    lng: number
  };
  id: number;
  name: string;
  
  constructor(attrs: any) {    
    this.address_components = attrs.address_components || [];
    this.formatted_address = attrs.formatted_address || "";
    this.geometry = attrs.geometry || {};
    this.id = attrs.id || null;
    this.name = attrs.name || null;
  }
  
  toOneClickPlace(): OneClickPlaceModel {
    return new OneClickPlaceModel({
      name: this.name,
      lat: this.geometry.lat,
      lng: this.geometry.lng,
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
  
}
