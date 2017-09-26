import { TripModel } from './trip';

export class TripRequestModel {
  trip: TripModel;
  trip_types: string[];
  user_profile: any;

  constructor(){
    this.trip = new TripModel;
    this.trip_types = [];
    this.user_profile = {};
  }
}
