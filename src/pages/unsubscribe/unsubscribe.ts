import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { OneClickProvider } from '../../providers/one-click/one-click';

/**
 * Generated class for the UnsubscribePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-unsubscribe',
  templateUrl: 'unsubscribe.html',
})
export class UnsubscribePage {
  
  email: string;
  unsubscribed: Boolean = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public oneClick: OneClickProvider,
              public events: Events) {
    this.email = navParams.data.email;
  }

  ionViewDidLoad() {
    
    // On load, show the spinner
    this.events.publish("spinner:show");
    
    // Attempt to unsubscribe the user. If successful, hide the spinner and show a success message
    // If unsuccessful, will re-route to home page with an error message.
    this.oneClick.unsubscribeUser(this.email)
        .subscribe((resp) => {
          this.events.publish("spinner:hide");
          this.unsubscribed = resp;
        })
  }

}
