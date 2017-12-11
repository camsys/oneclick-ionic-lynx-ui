import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { HelpersProvider } from '../../providers/helpers/helpers';

/**
 * Generated class for the ResponsiveTimepickerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'responsive-timepicker',
  templateUrl: 'responsive-timepicker.html'
})
export class ResponsiveTimepickerComponent {

  // // Reference the the ionic datepicker element (only used in browsers)
  @ViewChild('browserTimepicker') browserTimepicker: any;
  
  // Component accepts a date input to initialize it. Defaults to the current date and time.
  @Input() time: string = this.helpers.dateISOStringWithTimeZoneOffset(new Date());
  
  // Emits output events whenever the date changes.
  @Output() change = new EventEmitter<string>();
  
  times: any[] = []; // For holding list of available times.

  constructor(private nativeDatePicker: DatePicker,
              public platform: Platform,
              public helpers: HelpersProvider) { }
  
  ngOnInit() {
    // Set list of available times to 15-min increments.    
    this.times = this.helpers.getTimesArray(new Date(this.time), 15); 
  }
  
  open() {
    // Wait for platform to be ready...
    this.platform.ready()
    .then(() => {
      // ...then check if we're actually on a mobile device (as opposed to browser)
      // to determine which datepicker to open.
      if(this.platform.is('cordova')) {
        this.openNativeTimepicker();
      } else {
        this.openBrowserTimepicker();
      }
    })
  }
  
  // Opens the time select menu
  openBrowserTimepicker() {
    this.browserTimepicker.open();
    
    // Wait for the pop-up to show and then scroll to the selected element
    this.browserTimepicker._overlay.didEnter.subscribe(() => {
      setTimeout(() => { // The setTimeout is a hack to get it to skip a processing cycle so that the alert renders.
        document.getElementsByClassName('alert-radio-group')[0] // Find the alert's group of items
                .querySelector('[aria-checked="true"]') // Find the selected item
                .scrollIntoView({block: "center", behavior: "instant"}); // Scroll until it's in the center of the list
      });
    })

  }
  
  // Opens the native datepicker in ios or android, or defaults to the ionic datepicker in windows.
  openNativeTimepicker() {
    let oldTime = new Date(this.time);
    
    if(this.platform.is('android') || this.platform.is('ios')) {
      this.nativeDatePicker.show({
        date: oldTime,
        mode: 'time',
        minuteInterval: 15,
        androidTheme: this.nativeDatePicker.ANDROID_THEMES.THEME_HOLO_DARK
      }).then(
        (time) => {
          this.time = this.helpers.dateISOStringWithTimeZoneOffset(time);
          this.timeChange();
        },
        (err) => {
          console.error('Error occurred while getting date: ', err);
        }
      );
    } else { // if not ios or android, open ionic datepicker
      this.openBrowserTimepicker();
    }
  }
  
  // Whenever the time is changed, emit a change event with the new value.
  timeChange() {
    this.change.emit(this.time);
  }
  
  // Compares date objects to minute-level precision. Assumes same month and year.
  compareTimes(t1, t2): boolean {
    t1 = new Date(t1); // Convert t1 to a date object (t2 already is one)
    return (
      t1.getDate() === t2.getDate() &&
      t1.getHours() === t2.getHours() &&
      t1.getMinutes() === t2.getMinutes()
    )
  }

}
