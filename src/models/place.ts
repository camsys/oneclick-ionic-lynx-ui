import { AddressComponentModel } from './addressComponent';
import { LocationModel } from './location';


export class PlaceModel{
  address_components: AddressComponentModel[];
  formatted_address: string;
  geometry: LocationModel;
  id: number;
  name: string;

  constructor(latlng?: any){
    this.address_components = [];
    this.geometry = new LocationModel;
    if(latlng) {
      this.geometry.lat = latlng.lat;
      this.geometry.lng = latlng.lng;
    }
  }
  
}
