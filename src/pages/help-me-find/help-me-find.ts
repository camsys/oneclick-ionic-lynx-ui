import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { UserLocatorPage }    from '../user-locator/user-locator';

// PROVIDERS
import { OneClickProvider } from '../../providers/one-click/one-click';

// MODELS
import { Alert } from '../../models/alert';

/**
 * Generated class for the HelpMeFindPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-help-me-find',
  templateUrl: 'help-me-find.html',
})
export class HelpMeFindPage {

  alerts: Alert[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              public oneClickProvider: OneClickProvider) {
  }

  ionViewDidLoad() {
    this.oneClickProvider.getAlerts()
      .then(alerts => this.alerts = alerts)

  }

  openResourcesPage() {
    this.navCtrl.push(UserLocatorPage, { findServicesView: true});
  }

  openTransportationPage() {
    this.navCtrl.push(UserLocatorPage, { findServicesView: false});
  }

  presentAlerts() {

    document.getElementById('messages-button').style.display = "none";

    for(let entry of this.alerts) {
      console.log(entry);
      let alert = this.alertCtrl.create({
        title: entry.subject,
        subTitle: entry.message,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.ackAlert(entry);
          }
        }]
      });
      alert.present();
    }
  }

  ackAlert(alert: Alert){
    this.oneClickProvider.ackAlert(alert);
  }

}
