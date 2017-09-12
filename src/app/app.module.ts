import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Http, HttpModule } from '@angular/http';

// Pages
import { MyApp } from './app.component';
import { HelpMeFindPage }          from '../pages/help-me-find/help-me-find';
import { CategoriesFor211Page }    from '../pages/211/categories-for211/categories-for211';
import { SubcategoriesFor211Page } from '../pages/211/subcategories-for211/subcategories-for211';
import { MapFor211ServicesPage } from '../pages/211/map-for211-services/map-for211-services';
import { ServicesFromMatchListPage } from '../pages/211/services-from-match-list/services-from-match-list';
import { UserLocatorPage }  from '../pages/user-locator/user-locator';
import { ServiceFor211DetailPage } from '../pages/211/service-for211-detail/service-for211-detail'
import { ServiceFor211ReviewPage } from '../pages/211/service-for211-review/service-for211-review'
import { LocationAutoCompletePage }  from '../pages/location-auto-complete/location-auto-complete';
import { TransportationAgenciesPage } from '../pages/transportation-agencies/transportation-agencies';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { DirectionsPage } from '../pages/directions/directions';
import { DirectionsOptionsPage } from '../pages/directions-options/directions-options';
import { DirectionsRouteDetailPage } from '../pages/directions-route-detail/directions-route-detail';
import { DirectTransporationFinderPage } from '../pages/direct-transporation-finder/direct-transporation-finder';
import { TransportationEligibilityPage } from '../pages/transportation-eligibility/transportation-eligibility';
import { SignInPage } from '../pages/sign-in/sign-in';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { TemporaryLanguageTestingPage } from '../pages/temporary-language-testing/temporary-language-testing';
import { SubSubcategoriesFor211Page } from '../pages/211/sub-subcategories-for211/sub-subcategories-for211'
import { ServicesPage } from '../pages/211/services/services'

// Ionic Imports
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Geolocation } from '@ionic-native/geolocation';

// Other Imports
import { TranslateModule } from "ng2-translate";
import { TranslateLoader, TranslateStaticLoader } from "ng2-translate"

// Providers
import { OneClickProvider } from '../providers/one-click/one-click';
import { AuthProvider } from '../providers/auth/auth';
import { GeocodeServiceProvider } from '../providers/google/geocode-service';
import { GoogleMapsHelpersProvider } from '../providers/google/google-maps-helpers';
import { HelpersProvider } from '../providers/helpers/helpers';

// Models
import { CategoryFor211Model } from '../models/category-for-211';
import { SubcategoryFor211Model } from '../models/subcategory-for-211';
import { SubSubcategoryFor211Model } from '../models/sub-subcategory-for-211';
import { ServiceModel } from '../models/service';
import { AgencyModel } from '../models/agency';
import { AddressComponentModel } from '../models/addressComponent';
import { LocationModel } from '../models/location';
import { TripModel } from "../models/trip";
import { TripRequestModel } from "../models/trip-request";
import { TripResponseModel } from "../models/trip-response";
import { ItineraryModel } from "../models/Itinerary";
import { LegModel } from "../models/leg";
import { LegGeometryModel } from "../models/leg-geometry";
import { LegStepModel } from "../models/leg-step";


// Pipes
import { PrettyTimePipe } from '../pipes/pretty-time';
import { PrettyDistancePipe } from '../pipes/pretty-distance';


@NgModule({
  declarations: [
    MyApp,
    TemporaryLanguageTestingPage,
    HelpMeFindPage,
    UserLocatorPage,
    LocationAutoCompletePage,
    CategoriesFor211Page,
    SubcategoriesFor211Page,
    SubSubcategoriesFor211Page,
    ServicesPage,
    MapFor211ServicesPage,
    ServicesFromMatchListPage,
    ServiceFor211DetailPage,
    ServiceFor211ReviewPage,
    TransportationAgenciesPage,
    AboutUsPage,
    ContactUsPage,
    DirectTransporationFinderPage,
    DirectionsPage,
    DirectionsOptionsPage,
    DirectionsRouteDetailPage,
    TransportationEligibilityPage,
    ContactUsPage,
    SignInPage,
    UserProfilePage,
    PrettyTimePipe,
    PrettyDistancePipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactor: (createTranslateLoader),
      deps: [Http]
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TemporaryLanguageTestingPage,
    HelpMeFindPage,
    UserLocatorPage,
    LocationAutoCompletePage,
    CategoriesFor211Page,
    SubcategoriesFor211Page,
    SubSubcategoriesFor211Page,
    ServicesPage,
    MapFor211ServicesPage,
    ServicesFromMatchListPage,
    TransportationAgenciesPage,
    AboutUsPage,
    ServiceFor211DetailPage,
    ServiceFor211ReviewPage,
    ContactUsPage,
    DirectTransporationFinderPage,
    DirectionsPage,
    DirectionsOptionsPage,
    DirectionsRouteDetailPage,
    TransportationEligibilityPage,
    ContactUsPage,
    SignInPage,
    UserProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    OneClickProvider,
    GeocodeServiceProvider,
    GoogleMapsHelpersProvider,
    AuthProvider,
    HelpersProvider,
    CategoryFor211Model,
    SubcategoryFor211Model,
    SubSubcategoryFor211Model,
    ServiceModel,
    AgencyModel,
    AddressComponentModel,
    LocationModel,
    TripModel,
    TripRequestModel,
    TripResponseModel,
    ItineraryModel,
    LegModel,
    LegGeometryModel,
    LegStepModel
  ]
})

export class AppModule {}

export function createTranslateLoader(http: Http){
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
