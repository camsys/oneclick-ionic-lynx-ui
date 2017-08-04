/**
 * Created by mmaranda on 7/19/17.
 */

export class User {
  first_name: string;
  last_name: string;
  email: string;
  accommodations: Accommodation[];
  eligibilities: Eligibility[]; 
  preferred_locale: string;
  preferred_trip_types: string[]; 
  //location: string;
}

export class Eligibility {
  code: string;
  name: string;
  value: boolean;
}

export class Accommodation {
  code: string;
  name: string;
  value: boolean;
}
