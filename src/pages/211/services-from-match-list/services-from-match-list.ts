import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceModel } from '../../../models/service';
import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail';

/**
 * Generated class for the ServicesFromMatchListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-services-from-match-list',
  templateUrl: 'services-from-match-list.html',
})
export class ServicesFromMatchListPage {

  matches: ServiceModel[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.matches = navParams.data;
    this.orderByDriveTime();
  }

  ionViewDidLoad() {
  }

  orderByTransitTime()
  {
    return this.matches.sort(function (a : ServiceModel, b : ServiceModel) {
      //sorts by shortest transit time
      if( (a.transit_time == null && b.transit_time != null) ||
           a.transit_time < b.transit_time)
      {
        return -1
      }
      else if ((a.transit_time != null && b.transit_time == null) ||
         b.transit_time < a.transit_time)
      {
        return 1;
      }

      return 0;
    })
  }

  orderByDriveTime()
  {
    return this.matches.sort(function (a : ServiceModel, b : ServiceModel) {
      //sorts by shortest transit time
      if( (a.drive_time == null && b.drive_time != null) ||
        a.drive_time < b.drive_time)
      {
        return -1
      }
      else if ((a.drive_time != null && b.drive_time == null) ||
        b.drive_time < a.drive_time)
      {
        return 1;
      }

      return 0;
    })
  }

  openServicePage(match : ServiceModel){
    console.log(match);
    this.navCtrl.parent.viewCtrl._nav.push(ServiceFor211DetailPage, {service: match});
  }
}
