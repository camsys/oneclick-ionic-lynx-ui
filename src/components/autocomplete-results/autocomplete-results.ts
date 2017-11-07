import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { Events } from 'ionic-angular';


/**
 * Component for Displaying Autcomplete Results
 */
@Component({
  selector: 'autocomplete-results',
  templateUrl: 'autocomplete-results.html'
})
export class AutocompleteResultsComponent {
  
  @Input() items: any[] = [];
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onBlur: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFocus: EventEmitter<any> = new EventEmitter<any>();

  // Listener for keypresses, to move focus from one item to another
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    
    if(this.isFocused()) {
      if(event.code === "ArrowDown") {
        this.focusOnNextItem(); // Go to next item on down arrow
      } else if (event.code === "ArrowUp") {
        this.focusOnPreviousItem(); // Go to previous item on up arrow
      } else if (event.code === "Enter" || event.code === "Space") {
        this.selectFocusItem(); // On space or enter, select the focused item
      }
    }
    
  }
  
  focusItem: number = null;

  constructor(public events: Events, 
              public el: ElementRef) { }
  
  // When an item is selected, emit the onSelect event, passing the selected item.
  selectItem(item: any): any {
    this.onSelect.emit(item);
  }
  
  // Selects the focused item if it's in the range of the items list
  selectFocusItem() {
    if(this.focusItem >= 0 && this.focusItem < this.items.length) {
      this.selectItem(this.items[this.focusItem]);
    }
  }
  
  // Returns true if one of the items is focused on
  isFocused(): boolean {
    return this.focusItem != null;
  }
  
  // Applies focus to the list, defaulting to right before the first item
  focus() {
    if(!this.isFocused()) {
      this.focusItem = -1;
      this.onFocus.emit();
    }
  }
  
  // Unfocuses from any item on the list
  blur() {
    if(this.isFocused()) {
      this.focusItem = null;
      this.onBlur.emit();
    }
  }
  
  // Sets the focus to an item by index.
  // Focused item will be formatted differently.
  focusOnItem(index: number) {
    this.focusItem = index;
  }
  
  // Focuses on the next item, stopping at the end of the list.
  focusOnNextItem() {
    this.focusItem = Math.min(this.focusItem + 1, this.items.length - 1);
  }
  
  // Focuses on the previous item. If you get to the beginning of the list,
  // unfocus from the element.
  focusOnPreviousItem() {
    this.focusItem = this.focusItem - 1;
    if(this.focusItem < 0) {
      this.blur();      
    }
  }

}
