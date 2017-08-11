import { Component } from '@angular/core';
import {  IonicPage, 
          NavController, 
          NavParams, 
          ToastController } from 'ionic-angular';

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
              private authProvider: AuthProvider,
              private toastCtrl: ToastController) {
  }

  signIn() {
    this.authProvider.signIn(this.user.email, this.user.password)
        .subscribe(
          data => { 
            // On successful response, redirect the user to find page
            this.navCtrl.push(HelpMeFindPage);
          },
          error => {
            // On failed response, display a pop-up error message and remain on page.
            console.error(error.json().data.errors);
            let errorToast = this.toastCtrl.create({
              message: "There was a problem logging in. Please check your username and password and try again.",
              position: "top",
              duration: 3000
            });
            errorToast.present();
          }
        );
  }

}
