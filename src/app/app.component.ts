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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private inAppBrowser: InAppBrowser) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage },
      { title: 'Find', component: HelpMeFindPage },
      { title: 'Categories', component: CategoriesFor211Page},
      { title: 'Transportation Options', component: TransportationAgenciesPage},
      { title: 'About Us', component: AboutUsPage },
      { title: 'Contact Us', component: ContactUsPage },
      { title: 'Locator', component: UserLocatorPage},
      { title: 'Sign In', component: SignInPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openUrl(url: string) {
    this.platform.ready().then(() => {
      let browser = this.inAppBrowser.create(url);
      browser.show();
    });
  }
}
