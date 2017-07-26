import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Global } from '../../app/global';


@Injectable()
export class AuthProvider {

  public baseUrl = Global.BASE_ONECLICK_URL;  

  constructor(public http: Http) {
    console.log('Hello AuthProvider Provider', this.baseUrl);
  }
  
  signIn(email: string, password: string) {
    let uri: string = encodeURI(this.baseUrl + 'sign_in');
    let body = JSON.stringify({user: { email: email, password: password }});
    let options: RequestOptions = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    
    return this.http.post(uri, body, options)
      .map((response: Response) => {
        console.log("SUCCESSFUL LOG IN!", response);
        
          // // login successful if there's a jwt token in the response
          // let user = response.json();
          // if (user && user.token) {
          //     // store user details and jwt token in local storage to keep user logged in between page refreshes
          //     localStorage.setItem('currentUser', JSON.stringify(user));
          // }
          // 
          // return user;
    });
  }
  // 
  // logout() {
  //     // remove user from local storage to log user out
  //     localStorage.removeItem('currentUser');
  // }

}
