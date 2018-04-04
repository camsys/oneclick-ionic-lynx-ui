import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { environment } from '../../app/environment';

/**
 * Generated class for the LanguageSelectorModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-language-selector-modal',
  templateUrl: 'language-selector-modal.html',
})
export class LanguageSelectorModalPage {

  locale: string = null; // Selected locale
  available_locales: string[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController
              ) {

    // Include all available locales (including translation keys)
    // TODO: Set this to filter out keys locale unless admin user is logged in.
    this.available_locales = environment.AVAILABLE_LOCALES;

  }

  // Set the selected locale based on the passed nav params
  ionViewDidLoad() {
    this.locale = this.navParams.data.locale;
  }

  // Dismiss the modal with the selected locale as data returned
  submit() {
    this.viewCtrl.dismiss(this.locale);
  }

  // Dismiss the modal without the selected locale returned as data
  cancel() {
    this.viewCtrl.dismiss(null);
  }

  // Submit the modal automatically when a new locale is selected
  onLocaleChange() {
    this.submit();
  }


}
