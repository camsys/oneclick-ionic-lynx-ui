import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceModel } from '../../../models/service';
import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail';
import { HelpersProvider } from '../../../providers/helpers/helpers';

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
  orderBy: String;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private helpers: HelpersProvider) {
    this.matches = navParams.data;
    this.orderMatchList("drive_time");
  }

  ionViewDidLoad() {
  }
  
  // Orders the match list based on the passed string
  orderMatchList(orderBy: String) {
    if(orderBy == "transit_time") {
      this.orderByTransitTime();
    } else if(orderBy == "drive_time") {
      this.orderByDriveTime();
    } else {
      this.orderByDriveTime(); // by default, order by drive time
    }
    this.orderBy = orderBy;
  }

  orderByTransitTime()
  {
    let h = this.helpers;
    return this.matches.sort(function (a : ServiceModel, b : ServiceModel) {
      //sorts by shortest transit time
      return h.compareTimes(a.transit_time, b.transit_time);
    })
  }

  orderByDriveTime()
  {
    let h = this.helpers;
    return this.matches.sort(function (a : ServiceModel, b : ServiceModel) {
      //sorts by shortest transit time
      return h.compareTimes(a.drive_time, b.drive_time);
    })
  }

  openServicePage(match : ServiceModel){
    console.log(match);
    this.navCtrl.parent.viewCtrl._nav.push(ServiceFor211DetailPage, {service: match});
  }
}
