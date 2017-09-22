import { LegModel } from './leg';

export class ItineraryModel {
  trip_type:string;
  cost:number;
  walk_time:number;
  transit_time:number;
  walk_distance:number;
  legs:LegModel[];
  service:string;
  duration:number;
}
