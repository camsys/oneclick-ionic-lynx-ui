import { Pipe, PipeTransform } from '@angular/core';

/**
 * Takes a OneClick model class name and converts to a friendly string.
 */
@Pipe({
  name: 'prettyTableName',
})
export class PrettyTableNamePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(tableName: string) {
    return this.tableNameDictionary[tableName] || "";
  }
  
  tableNameDictionary: any = {
    "OneclickRefernet::Category": "Category",
    "OneclickRefernet::SubCategory": "Category",
    "OneclickRefernet::SubSubCategory": "Category",
    "OneclickRefernet::Service": "Service"
  };
}
