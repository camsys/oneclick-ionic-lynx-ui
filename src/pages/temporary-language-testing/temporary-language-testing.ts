import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateService } from 'ng2-translate';
import { Globalization } from 'ionic-native';
import { defaultLanguage, availableLanguages, testSystemWideLanguageConstant } from './temporary-language-settings.constants';


/**
 * Generated class for the TemporaryLanguageTestingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-temporary-language-testing',
  templateUrl: 'temporary-language-testing.html',
})
export class TemporaryLanguageTestingPage {
  translate: TranslateService;
  languages = availableLanguages;
  selectedLanguage = testSystemWideLanguageConstant.systemLanguage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TemporaryLanguageTestingPage');
    this.translate.setDefaultLang(defaultLanguage);

    if ((<any>window).cordova) {
      Globalization.getPreferredLanguage().then(result => {
        var language = this.getSuitableLanguage(result.value);
        this.translate.use(language);
        testSystemWideLanguageConstant.systemLanguage = language;
      });
    } else {
      let browserLanguage = this.translate.getBrowserLang() || defaultLanguage;
      var language = this.getSuitableLanguage(browserLanguage);
      this.translate.use(language);
      testSystemWideLanguageConstant.systemLanguage = language;
    }

  }


  applyLanguage() {
    this.translate.use(this.selectedLanguage);
  }

  getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
    return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
  }
}
