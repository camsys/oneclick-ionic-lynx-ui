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
      lng: this.geometry.lng
    })
  }
  
}
