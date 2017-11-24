import { Component } from '@angular/core';
import {  IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

// Pages
import { HelpMeFindPage } from '../help-me-find/help-me-find';
import { SignInPage } from '../sign-in/sign-in';

// Providers
import { AuthProvider } from '../../providers/auth/auth';
import { OneClickProvider } from '../../providers/one-click/one-click';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EmailAddressValidator } from '../../validators/email-address'

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
  signUpFormGroup: FormGroup;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              private authProvider: AuthProvider,
              private oneClickProvider: OneClickProvider,
              private toastCtrl: ToastController) {

    this.signUpFormGroup = formBuilder.group({
      formControlEmail: ['', Validators.compose([Validators.required, EmailAddressValidator.isValid, Validators.maxLength(30),])],
      formControlPassword: ['', Validators.compose([Validators.required])],
      formControlPasswordConfirm: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  signUp() {
    if(!this.signUpFormGroup.valid) {
      console.log("INVLAID submission DO NOT pass it on to the server");
      console.log(this.signUpFormGroup.errors.toString());
      let errorToast = this.toastCtrl.create({
        message: this.signUpFormGroup.errors.toString(),
        position: "top",
        duration: 3000
      });
      errorToast.present();
    }else {
      console.log("Valid submission pass it on to the server");
      this.authProvider
        .signUp(this.formControlEmail.value, this.formControlPassword.value, this.formControlPasswordConfirm.value)
        .subscribe(
          data => {this.navCtrl.push(SignInPage);},
          error => {
            console.error(error.json().data.errors);
                  let errorToast = this.toastCtrl.create({
                    message: "There was a problem logging in. Please check your username and password and try again.",
                    position: "top",
                    duration: 3000
                  });
                  errorToast.present();
          });
    }
  }

}
