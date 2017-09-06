import { LocationModel } from './location';

/**
 * Created by mmaranda on 6/21/17.
 */

export class TripModel {
  origin_attributes: LocationModel;
  destination_attributes: LocationModel;
  arrive_by: boolean;
  trip_time: string; //iso8601 time string
  purpose: string;
}
