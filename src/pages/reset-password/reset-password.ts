import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

// Providers
import { AuthProvider } from '../../providers/auth/auth';


// Models
import { User } from '../../models/user';




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
              private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    
  }
  
  resetPassword() {
    this.auth.resetPassword(this.email)
             .subscribe(
        data => {
          let successToast = this.toastCtrl.create({
            message: "Your password has been successfully reset. An email has been sent to " + this.email + ".",
            position: "top",
            duration: 3000
          });
          successToast.present();
        },
        error => { 
          console.error(error);
          let errorToast = this.toastCtrl.create({
            message: "There was a problem resetting your password. Please verify your email address and try again.",
            position: "top",
            duration: 3000
          });
          errorToast.present();
        }
      );
  }

}
