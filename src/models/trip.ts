import { OneClickPlaceModel } from "./one-click-place";


/**
 * Created by mmaranda on 6/21/17.
 */

export class TripModel {
  origin_attributes: OneClickPlaceModel;
  destination_attributes: OneClickPlaceModel;
  arrive_by: boolean;
  trip_time: string; //iso8601 time string
  purpose: string;
}
