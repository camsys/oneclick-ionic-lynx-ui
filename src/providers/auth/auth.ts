import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../app/environment';
import { Events } from 'ionic-angular';

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
              public events: Events,
              private translate: TranslateService) { }

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || "{}") as Session);
  }

  // Pulls the user object out of the session
  user(): User {
    return this.session().user as User;
  }

  // Gets the user's preferred locale
  preferredLocale(): string {
    return (this.user() || {})["preferred_locale"]
  }

  // Sets the local storage session variable to the passed object
  setSession(session: Session): void {
    localStorage.setItem('session', JSON.stringify(session));
  }
  
  // Returns true/false if user is signed in (guest or registered)
  // If optional User param, checks if that particular user is signed in
  isSignedIn(user?: User): Boolean {
    let session = this.session();
    if(user) {
      return !!(session && session.email && session.email === user.email);
    } else {
      return !!(session && session.email);      
    }
  }
  
  // Returns true/false if email address matches guest email addresses
  isGuestEmail(email: string): Boolean {
    return email.search(environment.GUEST_USER_EMAIL_DOMAIN) >= 0;
  }
  
  // Returns true/false if user is signed in and is a registered user
  isRegisteredUser(): Boolean {
    return this.isSignedIn() && !this.isGuestEmail(this.session().email);
  }

  // Returns true/false if user is signed in and is a guest user
  isGuestUser(): Boolean {
    return this.isSignedIn() && this.isGuestEmail(this.session().email);
  }

  // Constructs a hash of necessary Auth Headers for communicating with OneClick
  authHeaders(): Headers {
    if(this.isRegisteredUser()) {
      return new Headers({
        'Content-Type': 'application/json',
        'X-User-Email': this.session().email,
        'X-User-Token': this.session().authentication_token
      });
    } else if(this.isGuestUser()) {
      return new Headers({
        'Content-Type': 'application/json',
        'X-User-Email': this.session().email
      });
    } else {
      return this.defaultHeaders;
    }
  }

  //creates a new user
  signUp(email_address: string, password: string, password_confirmation: string): Observable<Response> {
    let uri: string = encodeURI(this.baseUrl + 'sign_up');
    let body = JSON.stringify({user: { email: email_address, password:  password, password_confirmation: password_confirmation }});
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
  updateSessionUser(user: User): User {
    let session = this.session();
    session.email = user.email;
    session.user = user;
    this.setSession(session);
    this.events.publish('user:updated', user);  // Publish user updated event for pages to listen to
    return this.user();
  }
  
  // Sets the preferred locale, regardless of whether or not user is logged in
  setPreferredLocale(locale: string): User {
    let user = (this.user() || {}) as User;
    user["preferred_locale"] = locale;
    return this.updateSessionUser(user);
  }

}
