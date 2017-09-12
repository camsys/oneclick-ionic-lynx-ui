import { LegStepModel } from './leg-step';
import { LegGeometryModel } from './leg-geometry';

export class LegModel {
  startTime:number;
  endTime:number;
  departureDelay:number;
  arrivalDelay:number;
  realTime:boolean;
  distance:number;
  pathway:boolean;
  mode:string;
  route:string;
  agencyTimeZoneOffset:number;
  interlineWithPreviousLeg:boolean;
  from:any;
  to:any;
  legGeometry:LegGeometryModel;
  // alerts:OBJECT[]
  rentedBike:boolean;
  transitLeg:boolean;
  duration:number;
  intermediateStops:string[];
  steps:LegStepModel[];
  serviceId:number;
  serviceName:string;
  serviceFareInfo:string;
  serviceLogoUrl:string;
  
  // constructor(legAttrs: any) {
  //   // Assign all attributes
  //   console.log("Constructor")
  //   // Object.keys(legAttrs).forEach((k) => { this[k] = legAttrs[k]; });
  // }
  
  public assignAttributes(legAttrs: any) {
    Object.keys(legAttrs).forEach((k) => { this[k] = legAttrs[k]; });
    return this;
  }

  // Returns the proper Ionic mode icon name based on the OTP mode code
  public modeIconName():string {
    switch(this.mode) {
      case 'WALK':
        return 'walk';
      case 'CAR':
        return 'car';
      case 'BUS':
        return 'bus';
      case 'TRAM':
      case 'SUBWAY':
        return 'train';
      case 'BICYCLE':
        return 'bicycle';
      default:
        return 'walk';
    }
  }
  
  // Returns true/false based on whether the leg has a transit mode code
  public isTransit():Boolean {
    return  this.mode === 'BUS' || 
            this.mode === 'TRAM' || 
            this.mode === 'SUBWAY';
  }

}
