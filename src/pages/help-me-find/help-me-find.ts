import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriesFor211Page }    from '../211/categories-for211/categories-for211';
import { TransportationAgenciesPage } from '../transportation-agencies/transportation-agencies';

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
    console.log('ionViewDidLoad HelpMeFindPage');
  }

  openResourcesPage() {
    this.navCtrl.push(CategoriesFor211Page);
  }

  openTransportationPage() {
    this.navCtrl.push(TransportationAgenciesPage);
  }

}
