import { Component } from '@angular/core';
import {  IonicPage, NavController, NavParams, ToastController, Toast } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

// Pages
import { HelpMeFindPage } from '../help-me-find/help-me-find';

// Providers
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  // formControlEmail: FormControl;
  // formControlPassword: FormControl;
  // formControlPasswordConfirm: FormControl;
  signUpFormGroup: FormGroup;
  submitAttempt: boolean = false;
  errorToast: Toast;


  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              private authProvider: AuthProvider,
              private toastCtrl: ToastController,
              private translate: TranslateService) {

    this.signUpFormGroup = formBuilder.group({
      formControlEmail: ['', Validators.compose([Validators.required, EmailAddressValidator.isValid, Validators.maxLength(30),])],
      formControlPassword: ['', Validators.compose([Validators.required])],
      formControlPasswordConfirm: ['', Validators.compose([Validators.required])]
    });
    this.errorToast = this.toastCtrl.create({});
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
          data => {this.navCtrl.push(HelpMeFindPage);},
          error => {
            let errors: string = '';
            errors = this.translate.instant("lynx.pages.sign_up.error_messages.default");

            if(error.json().data.errors.email == 'is invalid')
            {
              errors += this.translate.instant("lynx.pages.sign_up.error_messages.email_bad");
            }
            if(error.json().data.errors.email == 'has already been taken')
            {
              errors += this.translate.instant("lynx.pages.sign_up.error_messages.email_used");
            }
            if(error.json().data.errors.email == 'is too short (minimum is 6 characters)')
            {
              errors += this.translate.instant("lynx.pages.sign_up.error_messages.password_bad");
            }
            if(error.json().data.errors.password_confirmation == "doesn't match Password")
            {
              errors += this.translate.instant("lynx.pages.sign_up.error_messages.password_mismatch");
            }

            this.errorToast.dismissAll();

            this.errorToast = this.toastCtrl.create({
              message: errors,
              dismissOnPageChange: true,
              position: "top",
              duration: 10000
            });
            this.errorToast.present();
          });
    }
  }

}
