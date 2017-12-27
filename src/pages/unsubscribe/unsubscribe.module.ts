import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnsubscribePage } from './unsubscribe';

@NgModule({
  declarations: [
    UnsubscribePage,
  ],
  imports: [
    IonicPageModule.forChild(UnsubscribePage),
  ],
})
export class UnsubscribePageModule {}
