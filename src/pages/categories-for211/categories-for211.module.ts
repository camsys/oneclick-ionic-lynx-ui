import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesFor211Page } from './categories-for211';

@NgModule({
  declarations: [
    CategoriesFor211Page,
  ],
  imports: [
    IonicPageModule.forChild(CategoriesFor211Page),
  ],
  exports: [
    CategoriesFor211Page
  ]
})
export class CategoriesFor211PageModule {}
