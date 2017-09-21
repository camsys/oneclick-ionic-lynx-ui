import { AddressComponentModel } from './address-component';

export class GooglePlaceModel {
  address_components: AddressComponentModel[];
  formatted_address: string;
  geometry: {
    lat: number,
    lng: number
  };
  id: number;
  name: string;
}
