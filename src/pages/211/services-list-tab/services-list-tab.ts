import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, ToastController } from 'ionic-angular';
import { ServiceModel } from '../../../models/service';
import { HelpersProvider } from '../../../providers/helpers/helpers';
import { EmailModalPage } from "../../email-modal/email-modal";

/**
 * Generated class for the ServicesListTabPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-services-list-tab',
  templateUrl: 'services-list-tab.html',
})
export class ServicesListTabPage {

  services: ServiceModel[];
  orderBy: String;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private helpers: HelpersProvider,
              public events: Events) {
    this.services = navParams.data;
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
    return this.services.sort(function (a : ServiceModel, b : ServiceModel) {
      //sorts by shortest transit time
      return h.compareTimes(a.transit_time, b.transit_time);
    })
  }

  orderByDriveTime()
  {
    let h = this.helpers;
    return this.services.sort(function (a : ServiceModel, b : ServiceModel) {
      //sorts by shortest transit time
      return h.compareTimes(a.drive_time, b.drive_time);
    })
  }

  selectService(match : ServiceModel){
    this.events.publish('service:selected', match);
  }

  openEmailModal(services: ServiceModel[]) {
    console.log(services);
    let emailModal = this.modalCtrl.create(EmailModalPage, {services: services});
    emailModal.present();
  }
}
