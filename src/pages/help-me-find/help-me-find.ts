import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { UserLocatorPage }    from '../user-locator/user-locator';
// import { TransportationAgenciesPage } from '../transportation-agencies/transportation-agencies';
import { DirectTransporationFinderPage } from '../direct-transporation-finder/direct-transporation-finder';

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
      .then(not_used => this.presentAlerts())
  }

  openResourcesPage() {
    this.navCtrl.push(UserLocatorPage);
  }

  openTransportationPage() {
    this.navCtrl.push(DirectTransporationFinderPage);
  }

  presentAlerts() {
    for(let entry of this.alerts) {
      console.log(entry);
      let alert = this.alertCtrl.create({
        title: entry.subject,
        subTitle: entry.message,
        buttons: ['OK']
      });
      alert.present();
    }
  }

}
