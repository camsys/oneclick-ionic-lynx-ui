import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home'; //TODO REMOVE THIS
import { ListPage } from '../pages/list/list'; //TODO REMOVE THIS
import { HelpMeFindPage }          from '../pages/help-me-find/help-me-find';
import { CategoriesFor211Page }    from '../pages/211/categories-for211/categories-for211';
import { SubcategoriesFor211Page } from '../pages/211/subcategories-for211/subcategories-for211';
import { SubcategoryLinksFor211Page } from '../pages/211/subcategory-links-for211/subcategory-links-for211';
import { MatchListsFor211Page } from '../pages/211/match-lists-for211/match-lists-for211';
import { UserLocatorPage }  from '../pages/user-locator/user-locator';
import { TransportationAgenciesPage } from '../pages/transportation-agencies/transportation-agencies';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';

// Ionic Imports
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Geolocation } from '@ionic-native/geolocation';

// Providers
import { ReferNet211ServiceProvider } from '../providers/refer-net211-service/refer-net211-service';
import { OneClickProvider } from '../providers/one-click/one-click';

// Models
import { CategoryFor211Model } from '../models/category-for-211';
import { SubcategoryFor211Model } from '../models/subcategory-for-211';
import { SubcategoryLinkFor211Model } from '../models/subcategory-link-for-211';
import { MatchListFor211Model } from '../models/match-list-for-211';
import { AgencyModel } from '../models/agency';

@NgModule({
  declarations: [
    MyApp,
    HomePage, //TODO REMOVE THIS
    ListPage, //TODO REMOVE THIS
    HelpMeFindPage,
    UserLocatorPage,
    CategoriesFor211Page,
    SubcategoriesFor211Page,
    SubcategoryLinksFor211Page,
    MatchListsFor211Page,
    TransportationAgenciesPage,
    AboutUsPage,
    ContactUsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    HelpMeFindPage,
    UserLocatorPage,
    CategoriesFor211Page,
    SubcategoriesFor211Page,
    SubcategoryLinksFor211Page,
    MatchListsFor211Page,
    TransportationAgenciesPage,
    AboutUsPage,
    ContactUsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ReferNet211ServiceProvider,
    OneClickProvider,

    CategoryFor211Model,
    SubcategoryFor211Model,
    SubcategoryLinkFor211Model,
    MatchListFor211Model,
    AgencyModel
  ]
})
export class AppModule {}
