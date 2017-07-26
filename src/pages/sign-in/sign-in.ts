import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Providers
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log("SIGNING IN USER...");
    this.authProvider.signIn("test_user_09@camsys.com", "testpw")
        .subscribe(
          data => { console.log(data) },
          error => { console.error(error) }
        );
  }

}
