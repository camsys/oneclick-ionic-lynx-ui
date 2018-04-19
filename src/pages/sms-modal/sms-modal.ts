import { Component } from '@angular/core';
import { ServiceModel } from "../../models/service";
import { IonicPage, ViewController, NavParams, ToastController } from 'ionic-angular';
import { OneClickProvider } from '../../providers/one-click/one-click';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-sms-modal',
  templateUrl: 'sms-modal.html',
})
export class SmsModalPage {

  smsForm: FormGroup;
  service: ServiceModel;
  services: ServiceModel[];

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              public oneClick: OneClickProvider,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              private translate: TranslateService) {
     this.service = navParams.get('service');
     this.services = navParams.get('services');
     this.smsForm = this.formBuilder.group({
      sms: ['']
    });
  }

  cancel() {
    this.viewCtrl.dismiss(null);
  }

  send(){

    var ids = new Array();

    // Get Ids of Services Array if it was passed
    if(this.services != null){
      for (var i = 0; i < this.services.length; i++) {
        ids.push(this.services[i].id);
      }
    }

    // Get ID of a single service if it was passed
    if(this.service != null){
      ids.push(this.service.id);
    }

    var result = this.oneClick.sms211Service(this.smsForm.value['sms'],ids);
    this.viewCtrl.dismiss(null);
    let toast = this.toastCtrl.create({
      message: this.translate.instant('lynx.pages.sms.sms_sent'),
      position: 'bottom',
      duration: 3000
    });
    toast.present();

  }

  ionViewDidLoad() {
  }

}
