import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TemporaryLanguageTestingPage } from './temporary-language-testing';

@NgModule({
  declarations: [
    TemporaryLanguageTestingPage,
  ],
  imports: [
    IonicPageModule.forChild(TemporaryLanguageTestingPage),
  ],
  exports: [
    TemporaryLanguageTestingPage
  ]
})
export class TemporaryLanguageTestingPageModule {}
