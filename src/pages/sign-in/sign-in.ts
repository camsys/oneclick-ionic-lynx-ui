import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Pages
import { HelpMeFindPage } from '../help-me-find/help-me-find';

// Providers
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  user = { email: null, password: null };

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private authProvider: AuthProvider) {
  }

  signIn() {
    this.authProvider.signIn(this.user.email, this.user.password)
        .subscribe(
          data => { 
            // On successful response, redirect the user to find page
            this.navCtrl.push(HelpMeFindPage);
          },
          error => { 
            // TODO: On error response, display an alert and stay on page.
          }
        );
  }

}
