import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser'

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { HelpMeFindPage } from '../pages/help-me-find/help-me-find';
import { CategoriesFor211Page }    from '../pages/211/categories-for211/categories-for211';
import { TransportationAgenciesPage } from '../pages/transportation-agencies/transportation-agencies';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { UserLocatorPage }  from '../pages/user-locator/user-locator';
import { SignInPage }  from '../pages/sign-in/sign-in';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { AuthProvider } from '../providers/auth/auth'

import { UserServiceProvider } from '../providers/user/user-service'
import {User} from '../models/user';
import {Eligibility} from '../models/user';
import {Accommodation} from '../models/user';
import { OneClickProvider } from '../providers/one-click/one-click';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;
  title: String;
  user: User;
  eligibilities: Eligibility[];
  accommodations: Accommodation[];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private inAppBrowser: InAppBrowser, private auth: AuthProvider, private oneClickProvider: OneClickProvider) {
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

    this.title ="Welcome"

    // Menu if you are signed in
    if(this.auth.isSignedIn()){
      this.oneClickProvider.getProfile()
      .then(usr => this.user = usr)
      .then(usr => this.eligibilities = this.user.eligibilities)
      .then(usr => this.accommodations = this.user.accommodations)
      .then(usr => this.title = "Welcome " + this.user.first_name)

      this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'List', component: ListPage },
        { title: 'Find', component: HelpMeFindPage },
        { title: 'Categories', component: CategoriesFor211Page},
        { title: 'Transportation Options', component: TransportationAgenciesPage},
        { title: 'About Us', component: AboutUsPage },
        { title: 'Contact Us', component: ContactUsPage },
        { title: 'Locator', component: UserLocatorPage},
        { title: 'User Profile', component: UserProfilePage},
        { title: 'Sign Out', component: "sign_out"},
      ];
    }
    // Menu if you are not signed in
    else{

      this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'List', component: ListPage },
        { title: 'Find', component: HelpMeFindPage },
        { title: 'Categories', component: CategoriesFor211Page},
        { title: 'Transportation Options', component: TransportationAgenciesPage},
        { title: 'About Us', component: AboutUsPage },
        { title: 'Contact Us', component: ContactUsPage },
        { title: 'Locator', component: UserLocatorPage},
        { title: 'Sign In', component: SignInPage},
      ];
    }
  }  

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component == "sign_out"){
      this.signOut();
    }
    else{
      this.nav.setRoot(page.component);
    }
  }

  openUrl(url: string) {
    this.platform.ready().then(() => {
      let browser = this.inAppBrowser.create(url);
      browser.show();
    });
  }

  signOut() {
    this.auth.signOut()
    .subscribe(
      data => { 
        // On successful response, redirect the user to find page
        console.log('Signed Out');
        this.setMenu();
        this.nav.setRoot(HomePage);
      },
      error => {
        console.log('Error Signing Out');
        this.setMenu();
        this.nav.setRoot(HomePage);
      }
    );
  }

}
