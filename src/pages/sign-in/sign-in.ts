import { Component } from '@angular/core';
import {  IonicPage, 
          NavController, 
          NavParams,
          Events,
          ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

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
              private toastCtrl: ToastController,
              private translate: TranslateService,
              private events: Events) {
  }

  signIn() {
    this.authProvider
        .signIn(this.user.email, this.user.password)
        .subscribe(
          data => { 
            // Get the user's profile data and store it in the session
            this.oneClickProvider.getProfile()
                // Then, redirect the user to the home page
                .then((usr) => {
                  this.navCtrl.push(HelpMeFindPage);
                });
          },
          error => {            
            // On failed response, display a pop-up error message and remain on page.
            console.error(error.json().data.errors);
            let errorBody = error.json().data.errors;
            
            // Based on which log in attempt this is, customize the error message
            let errorCode = '';
            if (errorBody.last_attempt) {
              errorCode = 'last_attempt';
            } else if (errorBody.locked) {
              errorCode = 'locked';
            } else if (errorBody.unconfirmed){
              errorCode = 'unconfirmed';
            } else {
              errorCode = 'default';
            }
            
            let errorToast = this.toastCtrl.create({
              message: this.translate.instant("lynx.pages.sign_in.error_messages." + errorCode),
              position: "top",
              duration: 3000
            });
            errorToast.present();
          }
        );
  }
  
  resetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }

}
