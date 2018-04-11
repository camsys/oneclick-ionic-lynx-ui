import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Nav, Platform, Events, ModalController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService } from '@ngx-translate/core';

// PAGES
import { HelpMeFindPage } from '../pages/help-me-find/help-me-find';
import { ParatransitServicesPage } from '../pages/paratransit-services/paratransit-services';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { UserLocatorPage }  from '../pages/user-locator/user-locator';
import { SignInPage }  from '../pages/sign-in/sign-in';
import { SignUpPage } from '../pages/sign-up/sign-up'
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { LanguageSelectorModalPage } from '../pages/language-selector-modal/language-selector-modal';
import { FeedbackModalPage } from '../pages/feedback-modal/feedback-modal';
import { FeedbackStatusPage } from '../pages/feedback-status/feedback-status';

// MODELS
import { User } from '../models/user';
import { Eligibility } from '../models/eligibility';
import { Accommodation } from '../models/accommodation';
import { PageModel } from '../models/page';

// PROVIDERS
import { OneClickProvider } from '../providers/one-click/one-click';
import { AuthProvider } from '../providers/auth/auth';
import { I18nProvider } from '../providers/i18n/i18n';
import { ExternalNavigationProvider } from '../providers/external-navigation/external-navigation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HelpMeFindPage;
  showSpinner: Boolean = false;

  signedInPages: PageModel[];
  signedOutPages: PageModel[];
  universalPages: PageModel[]; //Pages for both signed in and signed out users
  signInPage: PageModel;
  signUpPage: PageModel;
  profilePage: PageModel;
  user: User;
  eligibilities: Eligibility[];
  accommodations: Accommodation[];
  locale: string;
  user_name: any = { user: "" };

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private auth: AuthProvider,
              private oneClickProvider: OneClickProvider,
              private changeDetector: ChangeDetectorRef,
              public events: Events,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private translate: TranslateService,
              private i18n: I18nProvider,
              public exNav: ExternalNavigationProvider) {

    this.initializeApp();

    // When a server error occurs, show an error message and return to the home page.
    this.events.subscribe("error:http", (error) => {
      this.handleError(error);
    });

    // When user is updated, update user info.
    this.events.subscribe("user:updated", (user) => {
      this.updateUserInfo(user);
    });
  }

  // Handles errors based on their status code
  handleError(error) {

    switch(error.status) {
      case 401: // Unauthorized--sign user out and send to sign in page
        console.error("USER TOKEN EXPIRED");
        this.signOut();
        this.nav.push(SignInPage);
        this.showErrorToast('lynx.global.error_message.auth_needed');
        break;
      default:
        this.goHome();
        this.showErrorToast('lynx.global.error_messages.default');
        break;
    }

    this.events.publish('spinner:hide'); // stop the spinner once we're back on the home page

  }

  // Shows an error toast at the top of the screen for 3 sec, with the given (translated) message
  showErrorToast(messageCode: string) {
    let errorToast = this.toastCtrl.create({
      message: this.translate.instant(messageCode),
      position: 'top',
      duration: 3000
    });
    errorToast.present();

    return errorToast;
  }

  initializeApp() {

    this.statusBar.styleDefault();
    this.splashScreen.hide();

    // Set up the page links for the sidebar menu
    this.setMenu();

    // Set up the spinner div
    this.setupSpinner();

    // Get info about signed-in user
    this.getUserInfo();

    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.platform.ready().then(() => {

      this.i18n.initializeApp(); // Sets the default language based on device or browser

      // Set the locale to whatever's in storage, or use the default
      this.i18n.setLocale(this.auth.preferredLocale());

    });

  }

  // Make a call to OneClick to get the user's details
  getUserInfo() {

    // If User email and token are stored in session, make a call to 1click to get up-to-date user profile
    if(this.auth.isRegisteredUser()){
      this.oneClickProvider.getProfile()
    }

  }

  // Updates this component's user model based on the information stored in the session
  updateUserInfo(usr) {
    this.user = usr;
    this.user_name = { user: usr.first_name || (usr.email || '').split('@')[0] };
    this.eligibilities = this.user.eligibilities;
    this.accommodations = this.user.accommodations;
  }

  // Set up the menu with pages for signed in and signed out scenarios
  setMenu(){

    // Pages to display regardless of whether or not user is signed in or not
    this.universalPages = [
      { title: 'home', component: "home" },
      { title: 'about_us', component: AboutUsPage },
      { title: 'contact_us', component: ContactUsPage },
      { title: 'transportation', component: ParatransitServicesPage },
      { title: 'resources', component: UserLocatorPage, params: { viewType: 'services'}},
      { title: 'language_selector', component: "language_selector" },
      { title: 'privacy_policy', component: "privacy_policy" },
      { title: 'live_211_chat', component: "live_211_chat" },
      { title: 'feedback', component: "feedback" }
    ] as PageModel[];

    // Pages to display if user is signed in
    this.signedInPages = this.universalPages.concat([
      { title: 'feedback_status', component: FeedbackStatusPage },
      { title: 'sign_out', component: "sign_out"}
    ] as PageModel[]);

    // Pages to display if user is signed out
    this.signedOutPages = ([
    ] as PageModel[]).concat(this.universalPages);

    this.signInPage = { title: 'sign_in', component: SignInPage} as PageModel;
    this.signUpPage = { title: 'sign_up', component: SignUpPage} as PageModel;
    this.profilePage = { title: 'profile', component: UserProfilePage} as PageModel;
  }

  // Open the appropriate page, or do something special for certain pages
  openPage(page) {
    switch(page.component) {
      case "home":
        this.goHome();
        break;
      case "sign_out":
        this.signOut();
        break;
      case "privacy_policy":
        this.exNav.goTo('http://www.golynx.com/privacy-policy.stml');
        break;
      case "language_selector":
        this.openLanguageSelectorModal();
        break;
      case "live_211_chat":
        this.exNav.goTo('https://server4.clickandchat.com/chat');
        break;
      case "feedback":
        FeedbackModalPage.createModal(this.modalCtrl,
                                      this.toastCtrl,
                                      this.translate)
                         .present();
        break;
      default:
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.push(page.component, page.params);
    }

  }

  // Check if we're already at the home page; if not, go there.
  goHome() {
    if((this.nav.getActive() && this.nav.getActive().name) !== "HelpMeFindPage") {
      this.nav.setRoot(HelpMeFindPage);
    }
  }

  signOut() {
    this.auth.signOut()
    .subscribe(
      data => {
        this.onSignOut();
      },
      error => {
        console.error('Error Signing Out');
        this.onSignOut();
      }
    );
  }

  onSignOut() {
    this.setMenu();
    this.nav.push(this.rootPage);
    // This isn't an error, but there is no difference in the toast
    this.showErrorToast('lynx.global.sign_out_successful');
  }

  // Creates and presents a modal for changing the locale.
  openLanguageSelectorModal() {
    let languageSelectorModal = this.modalCtrl.create(
      LanguageSelectorModalPage,
      { locale: this.i18n.currentLocale() }
    );
    languageSelectorModal.onDidDismiss(locale => {
      if(locale) {
        // If a new locale was selected, store it as the preferred locale in the session
        this.user = this.auth.setPreferredLocale(locale);

        // If user is signed in, update their information with the new locale.
        if(this.auth.isSignedIn()) {
          this.oneClickProvider.updateProfile(this.user);
        }
      }
    })
    languageSelectorModal.present();
  }

  // Subscribe to spinner:show and spinner:hide events that can be published by child pages
  setupSpinner() {
    this.events.subscribe('spinner:show', () => {
      this.showSpinner = true;
      this.changeDetector.markForCheck(); // Makes sure spinner doesn't lag
    });
    this.events.subscribe('spinner:hide', () => {
      this.showSpinner = false;
      this.changeDetector.detectChanges(); // Makes sure spinner doesn't lag
    });
  }

}
