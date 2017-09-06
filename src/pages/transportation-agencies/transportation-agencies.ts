import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Providers
import { OneClickProvider } from '../../providers/one-click/one-click';
import { HelpersProvider } from '../../providers/helpers/helpers';

// Models
import { AgencyModel } from '../../models/agency';

@IonicPage()
@Component({
  selector: 'page-transportation-agencies',
  templateUrl: 'transportation-agencies.html'
})
export class TransportationAgenciesPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private oneClickProvider: OneClickProvider,
              private helpers: HelpersProvider) {}
              
  transportationAgencies: AgencyModel[];

  ionViewDidLoad() {    
    this.oneClickProvider.getTransportationAgencies()
    .then(tps => this.transportationAgencies = tps);
  }

}
