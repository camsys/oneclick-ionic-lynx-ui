import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { UserLocatorPage }    from '../user-locator/user-locator';

// PROVIDERS
import { OneClickProvider } from '../../providers/one-click/one-click';

// MODELS
import { Alert } from '../../models/alert';

import { TranslateService } from '@ngx-translate/core';

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
              private platform: Platform,
              private alertCtrl: AlertController,
              public oneClickProvider: OneClickProvider,
              public translate: TranslateService) {
  }

  ionViewDidLoad() {
    
    // Wait until after platform is ready, so we have the user's preferred locale
    this.platform.ready().then(() => {
      this.oneClickProvider.getAlerts()
        .then(alerts => this.alerts = alerts);
    });
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
