import { Eligibility } from './eligibility';
import { Accommodation } from './accommodation';
import { Purpose } from './purpose';
import { SearchResultModel } from './search-result';

// Model for representing a transportation service from OneClick
// (as opposed to a service from ReferNET)
export class OneClickServiceModel {
  id?: number;
  name?: string;
  type?: string;
  url?: string;
  email?: string;
  phone?: string;
  formatted_phone?: string;
  description?: string;
  logo?: string;
  schedules?: any[];
  fare?: number; // Not on OneClick service model, but helps for storing associated itinerary info on the service
  purposes?: Purpose[];
  accommodations?: Accommodation[];
  eligibilities?: Eligibility[];
  
  constructor(attrs: any) {
    this.id = attrs.id;
    this.name = attrs.name;
    this.type = attrs.type;
    this.url = attrs.url;
    this.email = attrs.email;
    this.phone = attrs.phone;
    this.formatted_phone = attrs.formatted_phone;
    this.description = attrs.description;
    this.logo = attrs.logo;
    this.schedules = attrs.schedules;
    this.purposes = attrs.purposes || [];
    this.accommodations = attrs.accommodations || [];
    this.eligibilities = attrs.eligibilities || [];
  }
  
  search(query: string): Boolean {
    query = query.toLowerCase();
    return (
      this.name.toLowerCase().search(query) >= 0 ||
      this.description.toLowerCase().search(query) >= 0
    );
  }
  
  toSearchResult(): SearchResultModel {
    return {
      id: this.id,
      type: "Service",
      label: this.name,
      result: this 
    };
  } 
}
