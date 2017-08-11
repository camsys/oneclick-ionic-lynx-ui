import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  openResourcesPage() {
    this.navCtrl.push(UserLocatorPage);
  }

  openTransportationPage() {
    this.navCtrl.push(DirectTransporationFinderPage);
  }

}
