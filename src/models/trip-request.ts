import { TripModel } from './trip';

export class TripRequestModel {
  trip: TripModel;
  trip_types: string[];

  constructor(){
    this.trip = new TripModel;
    this.trip_types = [];
  }
}
