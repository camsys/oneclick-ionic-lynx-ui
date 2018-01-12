import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

// Providers
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the ResendEmailConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-resend-email-confirmation',
  templateUrl: 'resend-email-confirmation.html',
})
export class ResendEmailConfirmationPage {

  email: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AuthProvider,
              private toastCtrl: ToastController,
              private translate: TranslateService) {
  }

  ionViewDidLoad() {
  }

  resendEmailConfirmation() {
    this.auth.resendEmailConfirmation(this.email)
      .subscribe(
        data => {
          let successToast = this.toastCtrl.create({
            message: this.translate.instant("lynx.pages.resend_email_confirmation.success_message", {email: this.email}),
            position: "top",
            duration: 3000
          });
          successToast.present();
        },
        error => {
          console.error(error);
          let errorToast = this.toastCtrl.create({
            message: this.translate.instant("lynx.pages.resend_email_confirmation.error_message"),
            position: "top",
            duration: 3000
          });
          errorToast.present();
        }
      );
  }

}
