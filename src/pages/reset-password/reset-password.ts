import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

// Providers
import { AuthProvider } from '../../providers/auth/auth';



@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  email: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AuthProvider,
              private toastCtrl: ToastController,
              private translate: TranslateService) {
  }

  ionViewDidLoad() {
  }

  resetPassword() {
    this.auth.resetPassword(this.email)
             .subscribe(
        data => {
          let successToast = this.toastCtrl.create({
            message: this.translate.instant("lynx.pages.reset_password.success_message", { email: this.email }),
            position: "top",
            duration: 3000
          });
          successToast.present();
        },
        error => {
          console.error(error);
          let errorToast = this.toastCtrl.create({
            message: this.translate.instant("lynx.pages.reset_password.error_message"),
            position: "top",
            duration: 3000
          });
          errorToast.present();
        }
      );
  }

}
