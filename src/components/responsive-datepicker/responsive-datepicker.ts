import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { HelpersProvider } from '../../providers/helpers/helpers';


/**
 * Generated class for the ResponsiveDatepickerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'responsive-datepicker',
  templateUrl: 'responsive-datepicker.html'
})
export class ResponsiveDatepickerComponent {
  
  // Reference the the ionic datepicker element (only used in browsers)
  @ViewChild('browserDatepicker') browserDatepicker: any;
  
  // Component accepts a date input to initialize it. Defaults to the current date and time.
  @Input() date: string = this.helpers.dateISOStringWithTimeZoneOffset(new Date());
  
  // Emits output events whenever the date changes.
  @Output() change = new EventEmitter<string>();

  constructor(private nativeDatePicker: DatePicker,
              public platform: Platform,
              public helpers: HelpersProvider) {
  }
  
  // Shows the datepicker.
  open(evt) {
    console.log("OPENING DATEPICKER", this.browserDatepicker);
    
    // Wait for platform to be ready...
    this.platform.ready()
    .then(() => {
      // ...then check if we're actually on a mobile device (as opposed to browser)
      // to determine which datepicker to open.
      if(this.platform.is('cordova')) {
        this.openNativeDatepicker(evt);
      } else {
        this.openBrowserDatepicker(evt);
      }
    
    })
  }
  
  // Opens the native datepicker in ios or android, or defaults to the ionic datepicker in windows.
  openNativeDatepicker(evt) {
    if(this.platform.is('android') || this.platform.is('ios')) {
      this.nativeDatePicker.show({
        date: new Date(this.date),
        mode: 'datetime'
      }).then(
        (date) => { 
          this.date = this.helpers.dateISOStringWithTimeZoneOffset(date);
          this.dateChange();
        },
        (err) => {
          console.error('Error occurred while getting date: ', err);
        }
      );
    } else { // if not ios or android, open ionic datepicker
      this.openBrowserDatepicker(evt);
    }
  }
  
  // Opens the ionic datepicker.
  openBrowserDatepicker(evt) {
    console.log("OPENING BROWSER DATEPICKER", this.browserDatepicker, evt);
    this.browserDatepicker.onInputClick(evt);
    // this.browserDatepicker.containerElm.nativeElement.click();
    // this.browserDatepicker.open();
  }
  
  // Whenever the date is changed, emit a change event with the new value.
  dateChange() {
    console.log("DATE CHANGED", this.date);
    // this.change.emit(this.date);
  }
  
  onInputFocus(evt) {
    console.log("INPUT FOCUS", evt);
  }
  
  onInputBlur(evt) {
    console.log("INPUT BLUR", evt);
  }

}
