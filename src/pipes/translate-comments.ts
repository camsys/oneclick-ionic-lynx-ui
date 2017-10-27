import { Pipe, PipeTransform } from '@angular/core';
import { I18nProvider } from '../providers/i18n/i18n';

/**
 * Pulls the appropriate locale out of a comments hash
 */
@Pipe({
  name: 'translateComments',
})
export class TranslateCommentsPipe implements PipeTransform {

  constructor(private i18n: I18nProvider) { }

  transform(comments: any) {
    return comments && comments[this.i18n.currentLocale()];
  }
}
