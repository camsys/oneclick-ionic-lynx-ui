import { Component } from '@angular/core';
import {  IonicPage, 
          NavController, 
          NavParams, 
          ToastController } from 'ionic-angular';

// Pages
import { HelpMeFindPage } from '../help-me-find/help-me-find';
import { ResetPasswordPage } from '../reset-password/reset-password';

// Providers
import { AuthProvider } from '../../providers/auth/auth';
import { OneClickProvider } from '../../providers/one-click/one-click';

// Models
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  user: User = { email: null, password: null } as User;
  signInSubscription: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private authProvider: AuthProvider,
              private oneClickProvider: OneClickProvider,
              private toastCtrl: ToastController) {
  }

  signIn() {
    this.authProvider
        .signIn(this.user.email, this.user.password)
        .subscribe(
          data => { 
            // Get the user's profile data and store it in the session
            this.oneClickProvider.getProfile();
            
            // Redirect the user to the home page
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
        
    // Redirect the user to the home page
    this.navCtrl.push(HelpMeFindPage);
  }
  
  resetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }

}
