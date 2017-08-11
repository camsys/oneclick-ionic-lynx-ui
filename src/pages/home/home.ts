import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Providers
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              public authProvider: AuthProvider) {  }
  
  signOut() {
    console.log("SIGNING OUT");
    this.authProvider.signOut()
        .subscribe(
          data => { 
            console.log(data);
          },
          error => { 
            console.error(error);
          }
        );
  }
  
}
