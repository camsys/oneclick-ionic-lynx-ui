import { GooglePlaceModel } from '../models/google-place';
import { User } from '../models/user';

export class Session {
  email: string;
  authentication_token: string;
  user?: User;
  user_starting_location: GooglePlaceModel;
}
