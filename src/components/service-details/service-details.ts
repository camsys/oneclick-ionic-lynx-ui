import { Component, Input } from '@angular/core';

import { HelpersProvider } from '../../providers/helpers/helpers';
import { OneClickServiceModel } from "../../models/one-click-service";


/**
 * Component for presenting details of a transportation service. To be inserted into an ion-item.
 */
@Component({
  selector: 'service-details',
  templateUrl: 'service-details.html'
})
export class ServiceDetailsComponent {

  @Input() service: OneClickServiceModel;

  constructor(private helpers: HelpersProvider) {}
  
  purposeList(): string {
    return this.service.purposes.map((purp) => purp.name).join(', ');
  }

}
