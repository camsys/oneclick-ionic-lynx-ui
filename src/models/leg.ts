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
  // from:OBJECT
  // to:OBJECT
  legGeometry:LegStepModel;
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

}
