import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Globalization } from 'ionic-native';
import { Platform, Events } from 'ionic-angular';

import { environment } from '../../app/environment';
import { TranslateService } from '@ngx-translate/core';


/*
  Generated class for the I18nProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class I18nProvider {

  constructor(public http: Http,
              public events: Events,
              public platform: Platform,
              public translate: TranslateService) { }
  
  // Initializes the App, adding available languages and setting the default language
  initializeApp() {
    this.translate.addLangs(environment.AVAILABLE_LOCALES);
    this.translate.setDefaultLang(environment.DEFAULT_LOCALE);
    
    // If on mobile, try to get the device's preferred locale
    if(this.platform.is('cordova')) {
      Globalization.getPreferredLanguage().then(result => {
        this.translate.setDefaultLang(this.getSuitableLanguage(result.value));
      });
    } else { // Otherwise, try to get the browser's preferred locale
      this.translate.setDefaultLang(this.getSuitableLanguage(this.translate.getBrowserLang()));
    }
    
    // When user is updated, set locale to user's preferred locale.
    this.events.subscribe("user:updated", (user) => {
      if(user.preferred_locale) {
        this.setLocale(user.preferred_locale);
      }
    })
    

  }
  
  // Iron out any quirks in the browser/device's preferred locale code. Then,
  // check if it's in our list of available locales. If so, use it. Otherwise,
  // use the default locale.
  getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
    if(environment.AVAILABLE_LOCALES.some(loc => loc == language)) {
      return language;
    } else {
      return environment.DEFAULT_LOCALE;
    }
  }
  
  // Returns the current locale being used (or the default one)
  currentLocale(): string {
    return this.translate.currentLang || this.translate.getDefaultLang() || environment.DEFAULT_LOCALE;
  }
  
  // Sets the locale, defaulting to default language.
  setLocale(locale: string) {
    this.translate.use(locale || this.currentLocale());
  }
  


}
