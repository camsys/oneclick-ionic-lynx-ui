import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Providers
import { OneClickProvider } from '../../providers/one-click/one-click';
import { HelpersProvider } from '../../providers/helpers/helpers';

// Models
import { AgencyModel } from '../../models/agency';

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private oneClickProvider: OneClickProvider,
              private helpers: HelpersProvider) {}
              
  agencies: AgencyModel[];

  ionViewDidLoad() {    
    this.oneClickProvider.getPartnerAgencies()
    .then(agencies => this.agencies = agencies);
  }
  
}
