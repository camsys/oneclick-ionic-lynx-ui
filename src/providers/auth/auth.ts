import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../app/environment';

// Models
import { Session } from '../../models/session';
import { User } from '../../models/user';
import { GooglePlaceModel } from '../../models/google-place';

@Injectable()
export class AuthProvider {

  public baseUrl = environment.BASE_ONECLICK_URL;
  public defaultHeaders: Headers = new Headers({
    'Content-Type': 'application/json'
  })

  constructor(public http: Http,
              private translate: TranslateService) { }
  
  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || "{}") as Session);
  }
  
  // Pulls the user object out of the session
  user(): User {
    return this.session().user;
  }
  
  // Gets the user's preferred locale
  preferredLocale(): string {
    return (this.user() || {})["preferred_locale"]
  }
  
  // Sets the local storage session variable to the passed object
  setSession(session: Session): void {
    localStorage.setItem('session', JSON.stringify(session));
  }

  // Returns true/false if a user is signed in
  isSignedIn(): Boolean {
    let session = this.session();
    return !!(session && session.email && session.authentication_token);
  }

  // Constructs a hash of necessary Auth Headers for communicating with OneClick
  authHeaders(): Headers {
    if(this.isSignedIn()) {
      return new Headers({
        'Content-Type': 'application/json',
        'X-User-Email': this.session().email,
        'X-User-Token': this.session().authentication_token
      });
    } else {
      return this.defaultHeaders;
    }
  }

  // Signs in a user via email and password, storing their token to local storage
  signIn(email: string, password: string): Observable<Response> {
    let uri: string = encodeURI(this.baseUrl + 'sign_in');
    let body = JSON.stringify({user: { email: email, password: password }});
    let options: RequestOptions = new RequestOptions({
      headers: this.defaultHeaders
    });

    return this.http
        .post(uri, body, options)
        .map((response: Response) => {

          // Pull the session hash (user email and auth token) out of the response
          let data = response.json().data;
          let session = data.session || {};

          // Store session info in local storage to keep user logged in
          if(session.email && session.authentication_token) {
            this.setSession(session);
          }

          return response;
        });
  }

  // Removes session from local storage and tells backend to reset the user's token
  signOut(): Observable<Response> {

    // If signed in, remove the item from local storage and make sign out call
    if(this.isSignedIn()) {
      let uri: string = encodeURI(this.baseUrl + 'sign_out');
      let options: RequestOptions = new RequestOptions({
        headers: this.authHeaders()
      });

      localStorage.removeItem('session');

      return this.http
          .delete(uri, options)
          .map((response: Response) => {
            console.log(response);
            return response;
          });
    } else { // If not signed in, return an empty observable
      return Observable.of();
    }
  }
  
  // Resets the password of the provided user (only email required)
  resetPassword(email: string): Observable<Response>{    
    let uri: string = encodeURI(this.baseUrl + 'users/reset_password');
    let body = JSON.stringify({user: { email: email }});
    let options: RequestOptions = new RequestOptions({
      headers: this.defaultHeaders
    });
    
    return this.http
        .post(uri, body, options)
        .map((response: Response) => {
          return response;
        });
  }

  // Pulls the user location out of the session if available
  userLocation(): any {
    return (this.session().user_starting_location || 
            {geometry: environment.DEFAULT_LOCATION}) as GooglePlaceModel;
  }
  
  // Updates the session based on a user object, and updates the locale
  updateSessionUser(user: User) {
    let session = this.session();
    session.user = user;
    this.setSession(session);
    this.translate.use(this.preferredLocale());
    return this.user();
  }

}
