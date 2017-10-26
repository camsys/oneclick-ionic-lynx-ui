import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TranslateService } from '@ngx-translate/core';

// PAGES
import { HelpMeFindPage } from '../pages/help-me-find/help-me-find';
import { CategoriesFor211Page }    from '../pages/211/categories-for211/categories-for211';
import { ParatransitServicesPage } from '../pages/paratransit-services/paratransit-services';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { UserLocatorPage }  from '../pages/user-locator/user-locator';
import { SignInPage }  from '../pages/sign-in/sign-in';
import { UserProfilePage } from '../pages/user-profile/user-profile';

// MODELS
import {User} from '../models/user';
import {Eligibility} from '../models/eligibility';
import {Accommodation} from '../models/accommodation';
import { PageModel } from '../models/page';

// PROVIDERS
import { OneClickProvider } from '../providers/one-click/one-click';
import { AuthProvider } from '../providers/auth/auth';
import { I18nProvider } from '../providers/i18n/i18n';

import { environment } from './environment';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HelpMeFindPage;
  showSpinner: Boolean = false;

  signedInPages: PageModel[];
  signedOutPages: PageModel[];
  universalPages: PageModel[]; // Pages for both signed in and signed out users
  signInPage: PageModel;
  profilePage: PageModel;
  user: User;
  eligibilities: Eligibility[];
  accommodations: Accommodation[];
  locale: string;
  user_name: any;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private inAppBrowser: InAppBrowser,
              private auth: AuthProvider,
              private oneClickProvider: OneClickProvider,
              private changeDetector: ChangeDetectorRef,
              private translate: TranslateService,
              public events: Events,
              private i18n: I18nProvider) {
    this.initializeApp();
    this.getUserInfo();
    this.setMenu();
    this.setupSpinner();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.i18n.initializeApp(); // Sets the default language
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  
  // Make a call to OneClick to get the user's details
  getUserInfo() {
    
    // Menu if you are signed in
    if(this.auth.isSignedIn()){
      this.oneClickProvider.getProfile()
      .then((usr) => {
        this.user = usr;
        this.user_name = { user: usr.first_name };
        this.eligibilities = this.user.eligibilities;
        this.accommodations = this.user.accommodations;
      })
      .catch((error) => {
        // If the user token is expired, sign the user out automatically
        if(error.status === 401) {
          console.error("USER TOKEN EXPIRED", error);
          this.signOut();
        } else {
          console.error(error);
        }
      })
    }
    
  }

  // Set up the menu with pages for signed in and signed out scenarios
  setMenu(){
    
    // Pages to display regardless of whether or not user is signed in or not
    this.universalPages = [
      { title: 'about_us', component: AboutUsPage },
      { title: 'contact_us', component: ContactUsPage },
      { title: 'transportation', component: ParatransitServicesPage},
      { title: 'categories', component: CategoriesFor211Page},
      { title: 'resources', component: UserLocatorPage, params: { findServicesView: true}},
      { title: 'privacy_policy', component: "privacy_policy"}
    ]

    // Pages to display if user is signed in
    this.signedInPages = this.universalPages.concat([
      { title: 'sign_out', component: "sign_out"}
    ]);
    
    // Pages to display if user is signed out
    this.signedOutPages = this.universalPages.concat([
      { title: 'home', component: HelpMeFindPage },
    ]);
    
    this.signInPage = { title: 'sign_in', component: SignInPage};
    this.profilePage = { title: 'profile', component: UserProfilePage};
  }

  // Open the appropriate page, or do something special for certain pages
  openPage(page) {

    switch(page.component) {
      case "sign_out":
        this.signOut();
        break;
      case "privacy_policy":
        this.openUrl('http://www.golynx.com/privacy-policy.stml');
        break;
      default:
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component, page.params);
    }

  }

  openUrl(url: string) {
    this.platform.ready().then(() => {
      let browser = this.inAppBrowser.create(url);
      browser.show();
    });
  }

  goHome() {
    this.nav.setRoot(HelpMeFindPage);
  }

  signOut() {
    this.auth.signOut()
    .subscribe(
      data => {
        // On successful response, redirect the user to find page
        console.log('Signed Out');
        this.setMenu();
        this.goHome();
      },
      error => {
        console.log('Error Signing Out');
        this.setMenu();
        this.goHome();
      }
    );
  }

  // Subscribe to spinner:show and spinner:hide events that can be published by child pages
  setupSpinner() {
    this.events.subscribe('spinner:show', () => {
      this.showSpinner = true;
      this.changeDetector.detectChanges(); // Makes sure spinner doesn't lag
    });
    this.events.subscribe('spinner:hide', () => {
      this.showSpinner = false;
      this.changeDetector.detectChanges(); // Makes sure spinner doesn't lag
    });
  }

}
