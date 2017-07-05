import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubcategoriesFor211Page } from './subcategories-for211';

@NgModule({
  declarations: [
    SubcategoriesFor211Page,
  ],
  imports: [
    IonicPageModule.forChild(SubcategoriesFor211Page),
  ],
  exports: [
    SubcategoriesFor211Page
  ]
})
export class SubcategoriesFor211PageModule {}
