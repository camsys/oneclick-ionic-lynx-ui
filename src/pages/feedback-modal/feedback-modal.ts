import { Component, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams, 
         ViewController, Events, ModalController,
         ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { OneClickServiceModel } from "../../models/one-click-service";
import { ServiceModel } from "../../models/service";
import { FeedbackModel } from "../../models/feedback";
import { SearchResultModel } from "../../models/search-result";

import { OneClickProvider } from '../../providers/one-click/one-click';
import { AutocompleteResultsComponent } from "../../components/autocomplete-results/autocomplete-results";


/**
 * Generated class for the FeedbackModalPage page.
 */
@IonicPage()
@Component({
  selector: 'page-feedback-modal',
  templateUrl: 'feedback-modal.html',
})
export class FeedbackModalPage {
  
  // refernetService: ServiceModel;
  // oneclickService: OneClickServiceModel;
  subject: (ServiceModel | OneClickServiceModel);
  subjectType: string;
  feedbackForm: FormGroup;
  
  searchControl: FormControl = new FormControl;
  refernetResults: SearchResultModel[] = [];
  oneclickResults: SearchResultModel[] = [];
  searchResults: SearchResultModel[] = [];
  oneclickServices: OneClickServiceModel[];
  @ViewChild('searchResultsList') searchResultsList: AutocompleteResultsComponent;
  @ViewChild('searchInput') searchInput;
  
  @HostListener('keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if(event.code === "ArrowDown") {
      this.searchResultsList.focus(); // Focus on search results list when you arrow down from the input field
    }
  }
  
  // This is for formatting the phone input as a phone number.
  phoneMask: any = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public oneClick: OneClickProvider,
              public events: Events,
              public translate: TranslateService,
              private changeDetector: ChangeDetectorRef,
              private formBuilder: FormBuilder) {
    
    // Pull the subject(service) and subject type out of the navParams
    this.subject = this.navParams.data.subject;
    this.subjectType = this.navParams.data.type;
    
    // Build the feedback form with some default values.
    this.feedbackForm = this.formBuilder.group({
      rating: [0],
      review: [''],
      email: [''],
      phone: [''],
      feedbackable_id: [null],
      feedbackable_type: [null]
    });
    this.setSubjectValues();
    
    // Populates the paratransit services with a list from oneclick
    this.oneClick.getParatransitServices()
        .then((svcs) => {
          this.oneclickServices = svcs.map((svc) => {
            return new OneClickServiceModel(svc);
          });
        })
    
    // Search across services when subject search input changes
    this.searchControl.valueChanges
                      .debounceTime(500)
                      .subscribe((query) => {
      this.updateSearch(query);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackModalPage');
  }
  
  cancel() {
    this.viewCtrl.dismiss(null);
  }
  
  submit() {
    let feedback = this.feedbackForm.value as FeedbackModel;
    this.prependSubject(feedback);
    this.unmaskData(feedback);
    this.events.publish("spinner:show");
    this.oneClick.createFeedback(feedback)
    .then((resp) => {
      this.events.publish("spinner:hide");
      this.viewCtrl.dismiss(resp);
    })    
    .catch((err) => {
      this.events.publish("spinner:hide");
      this.viewCtrl.dismiss(err);
    });
  }
  
  // Unmasks phone number data
  unmaskData(feedback: FeedbackModel) {
    feedback.phone = feedback.phone.replace(/\D+/g, '');
  }
  
  // Searches for services based on the given query string
  updateSearch(query: string) {
    if(query) {
      
      // Search for refernet services by keyword
      this.oneClick.refernetKeywordSearch(query, "service")
          .subscribe((results) => {
            this.refernetResults = results;
            this.updateSearchResults();
          });
          
      // Filter out oneclick services by keyword, and map to search results
      this.oneclickResults = this.oneclickServices
                                 .filter((svc) => svc.search(query) )
                                 .map((svc) => svc.toSearchResult() );
      this.updateSearchResults();
          
    } else { // If query is empty, clear the results.
      this.clearSearchResults();
    }
  }
  
  // Combines the oneclick and refernet results into a single array
  updateSearchResults() {
    this.searchResults = this.refernetResults.concat(this.oneclickResults);
    if(this.searchResults.length === 0) {
      this.searchResults = [ this.emptySearchResult() ];
    }
    this.changeDetector.markForChanges();
  }
  
  // Empties out all search results arrays
  clearSearchResults() {
    this.oneclickResults = [];
    this.refernetResults = [];
    this.updateSearchResults();
  }
  
  // Returns a translated message for empty search results
  emptySearchResult(): SearchResultModel {
    return { 
      label: this.translate.instant('lynx.pages.feedback.empty_search_result'),
      type: null,
      result: null
    } as SearchResultModel;
  }
  
  // Selects a service from the search results and hides the results list
  selectResult(result: SearchResultModel) {
    this.subjectType = result.type;
    this.subject = result.result;
    this.setSubjectValues();
    this.searchResultsList.hide();
  }
  
  // Sets the feedbackable id and type in the form
  setSubjectValues() {
    if(this.subject && this.subjectType) {
      this.feedbackForm.controls['feedbackable_id'].setValue(this.subject.id);
      this.feedbackForm.controls['feedbackable_type'].setValue(this.subjectType);
    }
  }
  
  // Displays the subject picker
  showSubjectPicker() {  
    // Save the subject name to populate the input field
    let subjectName = this.subject["name"] || this.subject["agency_name"];
    
    // Set subject to null so that search input will appear
    this.subject = null;
    
    // Populate and focus on the search input field once it has time to render.
    setTimeout(() => {
      this.searchInput.value = subjectName;
      this.searchInput.setFocus();
    }, 100);
  }
  
  // If no subject is set, prepends the value of the subject picker input
  // to the feedback review
  prependSubject(feedback: FeedbackModel) {
    if(!this.subject) {
      feedback.review = [this.searchInput.value, feedback.review].join(": ");
    }
  }

}

// Exports a class method that builds a feedback modal. Pass in a ModalController,
// a ToastController, a TranslateService, and a hash containing an optional service object to be 
// the subject of the feedback. Returns the modal, so that present() can be called on it.
export namespace FeedbackModalPage {
  export function createModal(modalCtrl: ModalController,
                              toastCtrl: ToastController,
                              translate: TranslateService,
                              subjectData: {
                                subject?: (ServiceModel | OneClickServiceModel);
                                type?: string;
                              } = {}) {
    let feedbackModal = modalCtrl.create(FeedbackModalPage, subjectData);
    feedbackModal.onDidDismiss(data => {
      if(data) {
        let toast = toastCtrl.create({
          message: (data.status === 200 ? translate.instant("lynx.pages.feedback.success_message") : 
                                          translate.instant("lynx.pages.feedback.error_message")),
          position: 'bottom',
          duration: 3000
        });
        toast.present();
      }
    })
    return feedbackModal;
  }
}
