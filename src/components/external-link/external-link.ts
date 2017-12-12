import { Component, Input, Output, EventEmitter, 
         ChangeDetectorRef, HostListener } from '@angular/core';
         
import { ExternalNavigationProvider } from '../../providers/external-navigation/external-navigation';

/**
 * Generated class for the ExternalLinkComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'external-link',
  templateUrl: 'external-link.html'
})
export class ExternalLinkComponent {

  @Input() url: string;  
  @Input() text: string;

  constructor(public exNav: ExternalNavigationProvider) { }

}
