import { LegModel } from './leg';
import { OneClickServiceModel } from './one-click-service';

export class ItineraryModel {
  trip_type:string;
  cost:number;
  walk_time:number;
  transit_time:number;
  walk_distance:number;
  legs:LegModel[];
  service:OneClickServiceModel;
  duration:number;
}
