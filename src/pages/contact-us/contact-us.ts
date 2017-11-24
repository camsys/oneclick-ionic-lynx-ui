import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Providers
import { OneClickProvider } from '../../providers/one-click/one-click';
import { HelpersProvider } from '../../providers/helpers/helpers';

// Models
import { AgencyModel } from '../../models/agency';

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClickProvider: OneClickProvider,
              public helpers: HelpersProvider) {}

  agencies: AgencyModel[];

  ionViewDidLoad() {
    this.oneClickProvider.getAllAgencies()
    .then(agencies => this.agencies = agencies);
  }

}
