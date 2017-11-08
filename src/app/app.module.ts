// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { TextMaskModule } from 'angular2-text-mask';
import { ElasticModule } from 'angular2-elastic';
import { DatePicker } from '@ionic-native/date-picker';
import { LOCALE_ID } from '@angular/core';
// import { Observable } from 'rxjs/Rx'; 

// Environment
import { environment } from './environment';

// Ionic Imports
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Geolocation } from '@ionic-native/geolocation';

// Other 3rd-Party Imports

// Translations
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function createTranslateLoader(http: Http){
  // return new TranslateStaticLoader(http, 'assets/i18n', '.json');
  // return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
  return new TranslateHttpLoader(http, environment.AWS_BUCKET, '.json');
}

// Ratings
import { Ionic2RatingModule } from 'ionic2-rating'; // https://www.npmjs.com/package/ionic2-rating

// Pages
import { MyApp } from './app.component';
import { HelpMeFindPage }          from '../pages/help-me-find/help-me-find';
import { CategoriesFor211Page }    from '../pages/211/categories-for211/categories-for211';
import { SubcategoriesFor211Page } from '../pages/211/subcategories-for211/subcategories-for211';
import { ServicesMapTabPage } from '../pages/211/services-map-tab/services-map-tab';
import { ServicesListTabPage } from '../pages/211/services-list-tab/services-list-tab';
import { UserLocatorPage }  from '../pages/user-locator/user-locator';
import { ServiceFor211DetailPage } from '../pages/211/service-for211-detail/service-for211-detail'
import { ParatransitServicesPage } from '../pages/paratransit-services/paratransit-services';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { DirectionsPage } from '../pages/directions/directions';
import { DirectionsStepsTabPage } from '../pages/directions-steps-tab/directions-steps-tab';
import { DirectionsMapTabPage } from '../pages/directions-map-tab/directions-map-tab';
import { DirectTransporationFinderPage } from '../pages/direct-transporation-finder/direct-transporation-finder';
import { TransportationEligibilityPage } from '../pages/transportation-eligibility/transportation-eligibility';
import { SignInPage } from '../pages/sign-in/sign-in';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { SubSubcategoriesFor211Page } from '../pages/211/sub-subcategories-for211/sub-subcategories-for211'
import { ServicesPage } from '../pages/211/services/services'
import { TaxiServicesPage } from '../pages/taxi-services/taxi-services';
import { FeedbackModalPage } from '../pages/feedback-modal/feedback-modal';

// Providers
import { OneClickProvider } from '../providers/one-click/one-click';
import { AuthProvider } from '../providers/auth/auth';
import { GeocodeServiceProvider } from '../providers/google/geocode-service';
import { GoogleMapsHelpersProvider } from '../providers/google/google-maps-helpers';
import { HelpersProvider } from '../providers/helpers/helpers';
import { I18nProvider } from '../providers/i18n/i18n';

// Models
import { CategoryFor211Model } from '../models/category-for-211';
import { SubcategoryFor211Model } from '../models/subcategory-for-211';
import { SubSubcategoryFor211Model } from '../models/sub-subcategory-for-211';
import { ServiceModel } from '../models/service';
import { AgencyModel } from '../models/agency';
import { AddressComponentModel } from '../models/address-component';
import { LocationModel } from '../models/location';
import { TripModel } from "../models/trip";
import { TripRequestModel } from "../models/trip-request";
import { ItineraryModel } from "../models/itinerary";
import { LegModel } from "../models/leg";
import { LegGeometryModel } from "../models/leg-geometry";
import { LegStepModel } from "../models/leg-step";
import { PageModel } from "../models/page";
import { SearchResultModel } from "../models/search-result";

// Pipes
import { PrettyTimePipe } from '../pipes/pretty-time';
import { PrettyDistancePipe } from '../pipes/pretty-distance';
import { ToStringPipe } from '../pipes/to-string';
import { FormatPhoneNumberPipe } from '../pipes/format-phone-number';
import { PrettyFarePipe } from '../pipes/pretty-fare';
import { ScheduleTimePipe } from '../pipes/schedule-time';
import { ScheduleDayPipe } from '../pipes/schedule-day';

// Components
import { PlaceSearchComponent } from '../components/place-search/place-search';
import { ResponsiveDatepickerComponent } from '../components/responsive-datepicker/responsive-datepicker';
import { ResponsiveTimepickerComponent } from '../components/responsive-timepicker/responsive-timepicker';
import { PrettyTableNamePipe } from '../pipes/pretty-table-name';
import { ServiceDetailsComponent } from '../components/service-details/service-details';
import { AutocompleteResultsComponent } from '../components/autocomplete-results/autocomplete-results';

@NgModule({
  declarations: [
    MyApp,
    HelpMeFindPage,
    UserLocatorPage,
    CategoriesFor211Page,
    SubcategoriesFor211Page,
    SubSubcategoriesFor211Page,
    ServicesPage,
    TaxiServicesPage,
    ServicesMapTabPage,
    ServicesListTabPage,
    ServiceFor211DetailPage,
    ParatransitServicesPage,
    AboutUsPage,
    ContactUsPage,
    DirectTransporationFinderPage,
    DirectionsPage,
    DirectionsStepsTabPage,
    DirectionsMapTabPage,
    TransportationEligibilityPage,
    ContactUsPage,
    SignInPage,
    UserProfilePage,
    FeedbackModalPage,
    PrettyTimePipe,
    PrettyDistancePipe,
    ToStringPipe,
    FormatPhoneNumberPipe,
    PlaceSearchComponent,
    PrettyFarePipe,
    ScheduleTimePipe,
    ScheduleDayPipe,
    ResponsiveDatepickerComponent,
    ResponsiveTimepickerComponent,
    PrettyTableNamePipe,
    ServiceDetailsComponent,
    AutocompleteResultsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    TextMaskModule,
    ElasticModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelpMeFindPage,
    UserLocatorPage,
    CategoriesFor211Page,
    SubcategoriesFor211Page,
    SubSubcategoriesFor211Page,
    ServicesPage,
    TaxiServicesPage,
    ServicesMapTabPage,
    ServicesListTabPage,
    ServiceFor211DetailPage,
    ParatransitServicesPage,
    AboutUsPage,
    ContactUsPage,
    DirectTransporationFinderPage,
    DirectionsPage,
    DirectionsStepsTabPage,
    DirectionsMapTabPage,
    TransportationEligibilityPage,
    ContactUsPage,
    SignInPage,
    UserProfilePage,
    FeedbackModalPage,
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
    // TripResponseModel,
    ItineraryModel,
    LegModel,
    LegGeometryModel,
    LegStepModel,
    PageModel,
    SearchResultModel,
    DatePicker,
    I18nProvider,
    { 
      provide: LOCALE_ID,   // Angular pipes (date, currency, etc.) get their locale from this
      deps: [I18nProvider], 
      useFactory: (i18n) => i18n.currentLocale()
    }
  ],
  exports: [
    HelpMeFindPage,
    UserLocatorPage,
    CategoriesFor211Page,
    SubcategoriesFor211Page,
    SubSubcategoriesFor211Page,
    ServicesPage,
    TaxiServicesPage,
    ServicesMapTabPage,
    ServicesListTabPage,
    ServiceFor211DetailPage,
    ParatransitServicesPage,
    AboutUsPage,
    ContactUsPage,
    DirectTransporationFinderPage,
    DirectionsPage,
    DirectionsStepsTabPage,
    DirectionsMapTabPage,
    TransportationEligibilityPage,
    ContactUsPage,
    SignInPage,
    UserProfilePage,
    FeedbackModalPage,
    PlaceSearchComponent,
    ResponsiveDatepickerComponent,
    ResponsiveTimepickerComponent,
    ServiceDetailsComponent,

  ]
})

export class AppModule {}
