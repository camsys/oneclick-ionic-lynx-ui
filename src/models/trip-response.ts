import { User } from './user'

export class TripResponseModel {
  id: number;
  arrive_by: boolean;
  trip_time: string; //iso8601 time string
  purposes: string[];

  //TODO Complete itineraries model
  itineraries: string[];

  user: User;

  //TODO Complete accomodations & elegibilities models
  // accomodations: string[];
  // elegibilities: string[];
  // origin:
  // destination:

    constructor(){

  }
}
