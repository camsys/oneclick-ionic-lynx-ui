import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AutocompleteResultsComponent } from './autocomplete-results';

@NgModule({
  declarations: [
    AutocompleteResultsComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    AutocompleteResultsComponent
  ]
})
export class AutocompleteResultsComponentModule {}
