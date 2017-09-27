// Model for representing a transportation service from OneClick
// (as opposed to a service from ReferNET)
export class OneClickServiceModel {
  name?: string;
  type?: string;
  url?: string;
  email?: string;
  phone?: string;
  formatted_phone?: string;
  comments?: any;
  
  constructor(attrs: any) {    
    this.name = attrs.name;
    this.type = attrs.type;
    this.url = attrs.url;
    this.email = attrs.email;
    this.phone = attrs.phone;
    this.formatted_phone = attrs.formatted_phone;
    this.comments = attrs.comments;
  }
}
