import { Component } from '@angular/core';
import {  IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

// Pages
import { HelpMeFindPage } from '../help-me-find/help-me-find';

// Providers
import { AuthProvider } from '../../providers/auth/auth';
import { OneClickProvider } from '../../providers/one-click/one-click';
import {FormControl, FormGroup} from "@angular/forms";

/**
 * Generated class for the SignUpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  formControlEmail: FormControl;
  formControlPassword: FormControl;
  formControlPasswordConfirm: FormControl;
  formGroup: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authProvider: AuthProvider,
              private oneClickProvider: OneClickProvider,
              private toastCtrl: ToastController) {
    this.formControlEmail = new FormControl('value', validateEmail())
    this.formControlPassword = new FormControl('value', validatePassword())
    this.formControlPasswordConfirm = new FormControl('value', validatePasswordConfirm())

    this.formGroup = new FormGroup({
      email: new FormControl('test1');
      password: new FormControl('test2');
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  validateEmail()
  {

  }

  validatePassword()
  {

  }

  validatePasswordConfirm()
  {

  }

  signUp() {
    // this.authProvider
    //   .signIn(this.user.email, this.user.password)
    //   .subscribe(
    //     data => {
    //       // Get the user's profile data and store it in the session
    //       this.oneClickProvider.getProfile();
    //
    //       // Redirect the user to the home page
    //       this.navCtrl.push(HelpMeFindPage);
    //     },
    //     error => {
    //       // On failed response, display a pop-up error message and remain on page.
    //       console.error(error.json().data.errors);
    //       let errorToast = this.toastCtrl.create({
    //         message: "There was a problem logging in. Please check your username and password and try again.",
    //         position: "top",
    //         duration: 3000
    //       });
    //       errorToast.present();
    //     }
    //   );
    //

    console.log('This was submitted to the signUp actions class');

    // // Redirect the user to the home page
    // this.navCtrl.push(HelpMeFindPage);
  }

}
