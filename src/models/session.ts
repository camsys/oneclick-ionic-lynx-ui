import { PlaceModel } from '../models/place';

export class Session {
  email: string;
  authentication_token: string;
  user_starting_location: PlaceModel;
}
