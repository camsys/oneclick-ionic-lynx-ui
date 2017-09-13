import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser'

// PAGES
import { TemporaryLanguageTestingPage } from '../pages/temporary-language-testing/temporary-language-testing';
import { HelpMeFindPage } from '../pages/help-me-find/help-me-find';
import { CategoriesFor211Page }    from '../pages/211/categories-for211/categories-for211';
import { TransportationAgenciesPage } from '../pages/transportation-agencies/transportation-agencies';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { UserLocatorPage }  from '../pages/user-locator/user-locator';
import { SignInPage }  from '../pages/sign-in/sign-in';
import { UserProfilePage } from '../pages/user-profile/user-profile';

// MODELS
import {User} from '../models/user';
import {Eligibility} from '../models/user';
import {Accommodation} from '../models/user';
import { PageModel } from '../models/page';

// PROVIDERS
import { OneClickProvider } from '../providers/one-click/one-click';
import { AuthProvider } from '../providers/auth/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HelpMeFindPage;

  signedInPages: PageModel[];
  signedOutPages: PageModel[];
  signInPage: PageModel;
  profilePage: PageModel;
  user: User;
  eligibilities: Eligibility[];
  accommodations: Accommodation[];

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              private inAppBrowser: InAppBrowser, 
              private auth: AuthProvider, 
              private oneClickProvider: OneClickProvider) {
    this.initializeApp();
    this.setMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  setMenu(){

    // Menu if you are signed in
    if(this.auth.isSignedIn()){
      this.oneClickProvider.getProfile()
      .then((usr) => {
        this.user = usr;
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
    
    // Pages to display if user is signed in
    this.signedInPages = [
      { title: 'About Us', component: AboutUsPage },
      { title: 'Contact Us', component: ContactUsPage },
      { title: 'Transportation Options', component: TransportationAgenciesPage},
      { title: 'Browse Services by Category', component: CategoriesFor211Page},
      { title: 'Find Services by Location', component: UserLocatorPage},
      { title: 'Privacy Policy', component: "privacy_policy"},
      { title: 'Sign Out', component: "sign_out"}
    ];
    
    // Pages to display if user is signed out
    this.signedOutPages = [
      { title: 'Temporary Language Test', component: TemporaryLanguageTestingPage},
      { title: 'Home', component: HelpMeFindPage },
      { title: 'About Us', component: AboutUsPage },
      { title: 'Contact Us', component: ContactUsPage },
      { title: 'Transportation Options', component: TransportationAgenciesPage},
      { title: 'Browse Services by Category', component: CategoriesFor211Page},
      { title: 'Find Services by Location', component: UserLocatorPage},
      { title: 'Privacy Policy', component: "privacy_policy"}
    ];
    
    this.signInPage = { title: 'Sign In', component: SignInPage};
    this.profilePage = { title: 'My Profile', component: UserProfilePage};
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
        this.nav.setRoot(page.component);
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

}
