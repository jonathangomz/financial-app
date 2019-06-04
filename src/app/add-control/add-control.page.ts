import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StorageService, Control } from '../services/storage.service';
import { Md5 } from 'ts-md5/dist/md5';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-add-control',
  templateUrl: './add-control.page.html',
  styleUrls: ['./add-control.page.scss'],
  providers: [Md5]
})
export class AddControlPage implements OnInit {

  newItem: Control = <Control>{};
  loaderToShow: HTMLIonLoadingElement;

  constructor(
    private storageService: StorageService,
    private _md5: Md5,
    private navCtrl: NavController,
    public loadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.loaderToShow = await this.loadingController.create({
      message: 'Guardando...'
    });
  }

  async addNew(form:any) {
    let time = new Date();
    let hash = Md5.hashStr(time.toString());
    
    this.newItem.id = hash.toString();
    this.newItem.title = form.value['title'];
    this.newItem.content = form.value['content'];
    this.newItem.totalAmount = 0;
    
    await this.loaderToShow.present()
    await this.storageService.addControl(this.newItem);
    await this.loaderToShow.dismiss();

    this.navCtrl.back();
  }
}