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
  multiPickerColumns: any[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private alertCtrl: AlertController,
              public oneClickProvider: OneClickProvider) {
    this.multiPickerColumns = [
      {
        name: 'hrs',
        options: [
          { text: '1', value: '1' },
          { text: '2', value: '2' },
          { text: '3', value: '3' },
          { text: '4', value: '4' },
          { text: '5', value: '5' },
          { text: '6', value: '6' },
          { text: '7', value: '7' },
          { text: '8', value: '8' },
          { text: '9', value: '9' },
          { text: '10', value: '10' },
          { text: '11', value: '11' },
          { text: '12', value: '12' }
        ]
      },{
        name: 'mins',
        options: [
          { text: '00', value: '0' },
          { text: '15', value: '15' },
          { text: '30', value: '30' },
          { text: '45', value: '45' },
        ]
      },{
        name: 'ampm',
        options: [
          { text: 'am', value: 'am' },
          { text: 'pm', value: 'pm' }
        ]
      }
    ];
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
