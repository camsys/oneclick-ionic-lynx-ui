/**
 * Created by mmaranda on 6/21/17.
 */

export class ServiceModel {
  id: number;
  agency_name:string;
  site_name:string;
  lat:number;
  lng:number;
  address:string;
  drive_time: number;
  transit_time: number;
  phone: string;
  url: string;
  display_url: string; 
  details: {
    service_description: string;
    eligibility: string;
    fees: string;
    intake_procedure: string;
    program_service_hours: string;
    documents_required: string;
    payment_options: string;
    site_hours: string;
    languages_spoken: string;
    travel_instructions: string;
    area_served: string;
  };
}
