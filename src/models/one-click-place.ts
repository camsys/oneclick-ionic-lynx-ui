export class OneClickPlaceModel {
  name?: string;
  street_number?: string;
  route?: string;
  city?: string;
  state?: string;
  zip?: string;
  lat: number; // REQUIRED
  lng: number; // REQUIRED
  
  constructor(attrs: any) {    
    this.name = attrs.name;
    this.street_number = attrs.street_number;
    this.route = attrs.route;
    this.city = attrs.city;
    this.zip = attrs.zip;
    this.lat = attrs.lat;
    this.lng = attrs.lng;
  }
}
