import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home'; //TODO REMOVE THIS
import { ListPage } from '../pages/list/list'; //TODO REMOVE THIS
import { HelpMeFindPage }          from '../pages/help-me-find/help-me-find';
import { CategoriesFor211Page }    from '../pages/categories-for211/categories-for211';
import { SubcategoriesFor211Page } from '../pages/subcategories-for211/subcategories-for211'
// import {CategoriesFor211Component}          from "../pages/211_services/211_service_categories/categories-for-211.component";
// import {SubcategoriesFor211Component}       from "../pages/211_services/211_service_subcategories/subcategories-for-211.component";
// import {SubcategoryLinksFor211Component}    from '../pages/211_services/211_service_subcategory_links/subcategory-links-for-211.component';
// import {MatchListsFor211Component}          from '../pages/211_services/211_services_match_lists/match-lists-for-211.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReferNet211ServiceProvider } from '../providers/refer-net211-service/refer-net211-service';
import { InAppBrowser } from '@ionic-native/in-app-browser'

@NgModule({
  declarations: [
    MyApp,
    HomePage, //TODO REMOVE THIS
    ListPage, //TODO REMOVE THIS
    HelpMeFindPage,
    CategoriesFor211Page,
    SubcategoriesFor211Page,
    // SubcategoryLinksFor211Component,
    // MatchListsFor211Component
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    HelpMeFindPage,
    CategoriesFor211Page,
    SubcategoriesFor211Page,
    // SubcategoryLinksFor211Component,
    // MatchListsFor211Component
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ReferNet211ServiceProvider
  ]
})
export class AppModule {}
