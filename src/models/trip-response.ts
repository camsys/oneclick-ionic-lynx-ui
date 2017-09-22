import { User } from './user'
import { ItineraryModel } from "./itinerary";
import { OneClickPlaceModel } from './one-click-place';

export class TripResponseModel {
  id: number;
  arrive_by: boolean;
  trip_time: string; //iso8601 time string
  purposes: string[];
  itineraries: ItineraryModel[];
  user: User;
  origin: OneClickPlaceModel;
  destination: OneClickPlaceModel;
  
  constructor(attrs: any) {
    this.id = attrs.id;
    this.arrive_by = attrs.arrive_by || false;
    this.trip_time = attrs.trip_time;
    this.purposes = attrs.purposes || [];
    this.itineraries = attrs.itineraries || [];
    this.user = attrs.user;
    this.origin = attrs.origin;
    this.destination = attrs.destination;
  }
  
  // Returns the subset of itineraries that match the passed trip type string
  // ".slice(0)" makes a clone of the array, to avoid weird reference effects
  itinerariesByTripType(tripType: string) {
    return this.itineraries.slice(0).filter((itin) => itin.trip_type === tripType);
  }
}
