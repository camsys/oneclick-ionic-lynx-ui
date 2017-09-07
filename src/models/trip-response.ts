import { User } from './user'
import { ItineraryModel } from "./Itinerary";

export class TripResponseModel {
  id: number;
  arrive_by: boolean;
  trip_time: string; //iso8601 time string
  purposes: string[];
  itineraries: ItineraryModel[];
  user: User;

  //TODO Complete accomodations & elegibilities models
  // accomodations: string[];
  // elegibilities: string[];
  // origin:
  // destination:

    constructor(){

  }
}
