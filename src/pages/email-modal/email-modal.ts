import { Component } from '@angular/core';
import { ServiceModel } from "../../models/service";
import { IonicPage, ViewController, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { OneClickProvider } from '../../providers/one-click/one-click';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the EmailModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-email-modal',
  templateUrl: 'email-modal.html',
})
export class EmailModalPage {

  emailForm: FormGroup;
  service: ServiceModel;

  constructor(public navParams: NavParams, 
              public viewCtrl: ViewController, 
              public oneClick: OneClickProvider, 
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController) {
     this.service = navParams.get('service');
     this.emailForm = this.formBuilder.group({
      email: ['']
    });
  }

  cancel() {
    this.viewCtrl.dismiss(null);
  }

  send(){
    this.oneClick.email211Service(this.emailForm.value['email'],[this.service.id]);
    this.viewCtrl.dismiss(null);
    let toast = this.toastCtrl.create({
      message: "translate me email sent",
      position: 'bottom',
      duration: 3000
    });
    toast.present();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailModalPage');
  }

}
