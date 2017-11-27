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
  }

  signUp() {
    if(!this.signUpFormGroup.valid) {
      let errorToast = this.toastCtrl.create({
        message: this.signUpFormGroup.errors.toString(),
        position: "top",
        duration: 3000
      });
      errorToast.present();
    }else {
      this.authProvider
        .signUp(this.signUpFormGroup.controls.formControlEmail.value, this.signUpFormGroup.controls.formControlPassword.value, this.signUpFormGroup.controls.formControlPasswordConfirm.value)
        .subscribe(
          data => {this.navCtrl.push(SignInPage);},
          error => {
            let errors: string = "There was a problem with signup. Please, correct the following: <br />";

            if(error.json().data.errors.email == 'is invalid')
            {
              errors += "This email address is invalid. <br />"
            }
            if(error.json().data.errors.email == 'is used')
            {
              errors += "This email address is already. User email addresses must be unique. <br /> \n"
            }
            if(error.json().data.errors.email == 'is too short (minimum is 6 characters)')
            {
              errors += "Your password must be at least 6 characters. Please enter a new one. <br / \n"
            }
            if(error.json().data.errors.password_confirmation == "doesn't match Password")
            {
              errors += "The passwords do not match. Please retype them. <br />"
            }

            console.error(error.json().data.errors);
            let errorToast = this.toastCtrl.create({
              message: errors,
              position: "top",
              duration: 25000
            });
            errorToast.present();
          });
    }
  }

}
