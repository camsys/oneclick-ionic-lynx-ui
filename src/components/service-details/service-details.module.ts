import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ServiceDetailsComponent } from './service-details';

@NgModule({
  declarations: [
    ServiceDetailsComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    ServiceDetailsComponent
  ]
})
export class ServiceDetailsComponentModule {}
