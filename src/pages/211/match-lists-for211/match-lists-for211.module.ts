import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchListsFor211Page } from './match-lists-for211';

@NgModule({
  declarations: [
    MatchListsFor211Page,
  ],
  imports: [
    IonicPageModule.forChild(MatchListsFor211Page),
  ],
  exports: [
    MatchListsFor211Page
  ]
})
export class MatchListsFor211PageModule {}
