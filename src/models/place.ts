import { AddressComponentModel } from './addressComponent';
import { LocationModel } from './location';


export class PlaceModel{
  address_components: AddressComponentModel[];
  formatted_address: string;
  geometry: LocationModel;
  id: number;
  name: string;
}
