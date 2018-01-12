import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { ServiceModel } from '../../../models/service';
import { Session } from '../../../models/session';
import { GooglePlaceModel } from "../../../models/google-place";
import { HelpersProvider } from '../../../providers/helpers/helpers';
import { EmailModalPage } from "../../email-modal/email-modal";
import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail';

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
    let startLocation = this.session().user_starting_location;
    let destination_location = new GooglePlaceModel({
      address_components: null,
      geometry: {location: {lat: match.lat, lng: match.lng}},
      formatted_address: null,
      id: null,
      name: null
    });

    this.navCtrl.parent.viewCtrl._nav.push(ServiceFor211DetailPage, {service_id: match.service_id, location_id: match.location_id, origin: startLocation, destination: destination_location});
  }

  openEmailModal(services: ServiceModel[]) {
    let emailModal = this.modalCtrl.create(EmailModalPage, {service: services});
    emailModal.present();
  }

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }
}
