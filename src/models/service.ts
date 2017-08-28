/**
 * Created by mmaranda on 6/21/17.
 */

export class ServiceModel {
 agency_name:string;
 site_name:string;
 lat:string;
 lng:string;
 address:string;
 drive_time: string;
 transit_time: string;

 drivingTimeToHumanReadable(): string
 {
   console.log('IN drivingTimeToHumanReadable ==='+this.drive_time);

   if(this.drive_time != null){
     return this.secondsToString(this.drive_time);
   }

   return 'N/A'
 }

 transitTimeToHumanReadable(): string
 {
   console.log('IN transitTimeToHumanReadable ==='+this.transit_time);

   if(this.transit_time != null){
     return this.secondsToString(this.transit_time);
   }

   return 'N/A'
 }

 private secondsToString(time: string): string
 {
   let s: number = Number(time);

   console.log('seconds to string =='+s);

   let hours = Math.floor(s / 3600);
   console.log('hours =='+hours);
   let minutes = Math.floor(s % 3600 / 60);
   console.log('minutes =='+minutes);
   let seconds = Math.floor(s % 3600 % 60);
   console.log('seconds =='+seconds);

   if(seconds >= 30)
   {
     minutes += 1;
   }

   let timeString = '';

    if(hours > 0)
    {
      timeString = hours+' h '+minutes+' m'
    }else {
      timeString = minutes+' m'
    }

    console.log(timeString);

   return timeString;
 }
}
