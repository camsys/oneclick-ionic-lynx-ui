import { User } from './user';
import { Eligibility } from './eligibility';
import { Accommodation } from './accommodation';
import { Purpose } from './purpose';
import { ItineraryModel } from "./itinerary";
import { OneClickPlaceModel } from './one-click-place';

export class TripResponseModel {
  id: number;
  arrive_by: boolean;
  trip_time: string; //iso8601 time string
  itineraries: ItineraryModel[];
  user: User;
  origin: OneClickPlaceModel;
  destination: OneClickPlaceModel;
  accommodations: Accommodation[];
  eligibilities: Eligibility[]; 
  purposes: Purpose[];
  
  constructor(attrs: any) {
    this.id = attrs.id;
    this.arrive_by = attrs.arrive_by || false;
    this.trip_time = attrs.trip_time;
    this.purposes = attrs.purposes || [];
    this.itineraries = attrs.itineraries || [];
    this.user = attrs.user;
    this.origin = attrs.origin;
    this.destination = attrs.destination;
    this.accommodations = attrs.accommodations || [];
    this.eligibilities = attrs.eligibilities || [];
  }
  
  // Returns the subset of itineraries that match the passed trip type string
  // ".slice(0)" makes a clone of the array, to avoid weird reference effects
  itinerariesByTripType(tripType: string) {
    return this.itineraries.slice(0).filter((itin) => itin.trip_type === tripType);
  }
  
  // Returns an array of costs by trip type, ignoring non-numeric values
  costsByTripType(tripType: string) {
    let costs = this.itinerariesByTripType(tripType)
                    .map((itin) => itin.cost)
                    .filter((cost) => typeof(cost) === "number");
    return costs;
  }
  
  // returns true/false if the trip includes an itinerary of the given mode
  includesTripType(tripType: string) {
    return this.itineraries
               .map((itin) => itin.trip_type)
               .findIndex((tt) => tt === tripType) >= 0
  }

}
