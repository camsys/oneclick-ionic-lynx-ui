import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { UserLocatorPage }    from '../user-locator/user-locator';
// import { TransportationAgenciesPage } from '../transportation-agencies/transportation-agencies';
import { DirectTransporationFinderPage } from '../direct-transporation-finder/direct-transporation-finder';



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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {  
    this.presentAlerts();  
  }

  openResourcesPage() {
    this.navCtrl.push(UserLocatorPage);
  }

  openTransportationPage() {
    this.navCtrl.push(DirectTransporationFinderPage);
  }

  presentAlerts() {
    let alerts = [[1, "Hello", "This is a short message"], [2, "What?","This is a much longer message.  I wonder what it will look like, it might be a little wonky looking to show it in such a small space.  But we will see what it does."]];
    for(let entry of alerts) {
      console.log(entry);
      let alert = this.alertCtrl.create({
        title: "texty",
        subTitle: "mo texty",
        buttons: ['OK']
      });
      alert.present();
    }
  }

}
