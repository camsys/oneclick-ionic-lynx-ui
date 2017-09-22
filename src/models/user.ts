/**
 * Created by mmaranda on 7/19/17.
 */

export class User {
  first_name: string;
  last_name: string;
  email: string;
  alerts: Alert[];
  accommodations: Accommodation[];
  eligibilities: Eligibility[]; 
  preferred_locale: string;
  trip_types: TripType[]; 
  password: string;
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

export class TripType {
  code: string;
  name: string;
  value: boolean;
}

export class Alert {
  id: number; 
  subject: string;
  message: string;
}