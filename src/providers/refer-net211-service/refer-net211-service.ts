import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import {CategoryFor211Model}          from '../../models/category-for-211';
import {SubcategoryFor211Model}       from '../../models/subcategory-for-211';
import {SubcategoryLinkFor211Model}   from '../../models/subcategory-link-for-211';
import {MatchListFor211Model}         from '../../models/match-list-for-211';

/*
  Generated class for the ReferNet211ServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class ReferNet211ServiceProvider {

  private refernetUrl = 'http://www.referweb.net/mws/service.asmx/';

  constructor(private http: Http) {
  }

  api_key: string = 'KIXUUKWX';
  state: string = 'FLORIDA';

  //We are using the promise format over the observable format because we are performing a simple get request and not doing much with the data beyond displaying it.
  //We expect reasonable quick responses from the server and won't likely run into a request-cancel-new-request sequence.

  getCategoriesFor211Services(): Promise<CategoryFor211Model[]> {
    var uri: string = encodeURI(this.refernetUrl+'Category?API_KEY='+this.api_key+'&DeviceID=');

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(str => this.stripAwayXml(str))
      .then(jsonable => JSON.parse(jsonable) as CategoryFor211Model)
      .catch(this.handleError);
  }

  getSubcategoryForCategoryName(categoryName: string): Promise<SubcategoryFor211Model[]> {
    var uri: string = encodeURI(this.refernetUrl+'Sub_Category?API_KEY='+this.api_key+'&category_name='+categoryName+'&DeviceID=');

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(str => this.stripAwayXml(str))
      .then(jsonable => JSON.parse(jsonable) as SubcategoryFor211Model)
      .catch(this.handleError);
  }

  getSubcategoryLinkForSubcategoryId(categoryId: number): Promise<SubcategoryLinkFor211Model[]>{

    var uri: string = encodeURI(this.refernetUrl+'SubCat_Links?API_KEY='+this.api_key+'&category_id='+categoryId+'&DeviceID=');

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(str => this.stripAwayXml(str))
      .then(jsonable => JSON.parse(jsonable) as SubcategoryFor211Model)
      .catch(this.handleError);
  }

  getMatchListForSubcategoryLinkNameAndCountyCode(subcategroyLinkName: string, countyCode: number): Promise<MatchListFor211Model[]>{
  // getMatchListForSubcategoryLinkNameAndCountyCode(subcategroyLinkName: string, countyCode: number): Promise<string[]>{

    var uri: string = encodeURI(this.refernetUrl+'MatchList?API_KEY='+this.api_key+'&zip='+'&searchterm='+subcategroyLinkName+'&county_id='+countyCode+'&DeviceID=');

    // console.log(uri);

    return this.http.get(uri)
      .toPromise()
      .then(response => response.text())
      .then(str => this.stripAwayXml(str))
      .then(jsonable => JSON.parse(jsonable) as string)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    console.error('An error occurred', error.text()); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  private stripAwayXml(xml: string): string{

    var jsonable_text: string = '[]';

    var start_of_json: number = xml.indexOf('[{');
    var end_of_json:number = xml.indexOf('}]');
    if(start_of_json >= 0 && end_of_json > 0)
    {
      jsonable_text = xml.substring(start_of_json, end_of_json+2);
    }

    // console.log(jsonable_text);

    return jsonable_text;
  }

}
