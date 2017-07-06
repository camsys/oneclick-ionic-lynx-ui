import { NgModule } from '@angular/core';
import { IonicPageModule} from 'ionic-angular';
import { HelpMeFindPage } from './help-me-find';



@NgModule({
  declarations: [
    HelpMeFindPage,
  ],
  imports: [
    IonicPageModule.forChild(HelpMeFindPage),
  ],
  exports: [
    HelpMeFindPage
  ]
})

export class HelpMeFindPageModule {
}
