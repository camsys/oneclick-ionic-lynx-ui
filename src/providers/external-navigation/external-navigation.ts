import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { TranslateService } from '@ngx-translate/core';

/*
  External Navigation Provider warns the user before linking to an external site
*/
@Injectable()
export class ExternalNavigationProvider {

  constructor(public http: Http,
              public alertCtrl: AlertController,
              public inAppBrowser: InAppBrowser,
              public translate: TranslateService) { }
  
  // Opens an external website, but first confirms with the user that they want to leave the site
  goTo(url: any) {
    let confirmExit = this.alertCtrl.create({
      title: this.translate.instant("lynx.pages.external_navigation.header"),
      message: this.translate.instant("lynx.pages.external_navigation.message"),
      buttons: [
        {
          text: this.translate.instant("lynx.pages.external_navigation.cancel_button"),
          role: 'cancel',
          handler: () => { }
        },
        {
          text: this.translate.instant("lynx.pages.external_navigation.confirm_button"),
          handler: () => {
            this.goDirectlyTo(url);
          }
        }
      ]
    })
    confirmExit.present();
  }
  
  // Navigates directly to the given url.
  goDirectlyTo(url: any) {
    this.inAppBrowser.create(url, '_system');
  }

}
