import { Component, OnInit } from '@angular/core';
import { StorageService, Control } from '../services/storage.service';
import { Md5 } from 'ts-md5/dist/md5';
import { NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-add-control',
  templateUrl: './add-control.page.html',
  styleUrls: ['./add-control.page.scss'],
  providers: [Md5]
})
export class AddControlPage implements OnInit {

  newControl: Control = <Control>{};
  control:Control = <Control>{};
  loaderToShow: HTMLIonLoadingElement;
  type:string;
  control_id:string;
  titleTemplate:string = 'Argega uno nuevo';
  buttonTemplate:string = 'CREAR';

  constructor(
    private storageService: StorageService,
    private _md5: Md5,
    private navCtrl: NavController,
    public loadingController: LoadingController,
    private route: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe(async params => {
      this.type = params["type"];
      if(this.type) {
        if(this.type === 'UPDATE'){
          this.titleTemplate = 'Actualización de datos';
          this.buttonTemplate = 'ACTUALIZAR';
          this.control_id = params["id"];
          this.control = await storageService.getControl(this.control_id);
        }
      }
    });
  }

  async ngOnInit() {
    this.loaderToShow = await this.loadingController.create({
      message: 'Guardando...'
    });
  }

  async addOrUpdate(form:any) {
    let time = new Date();
    let hash = Md5.hashStr(time.toString());
    
    this.newControl.title = form.value['title'];
    this.newControl.content = form.value['content'];
    
    await this.loaderToShow.present();

    if(this.type === 'NEW'){
      this.newControl.id = hash.toString();
      this.newControl.totalAmount = 0;
      await this.storageService.addControl(this.newControl);
    } else {
      this.newControl.id = this.control_id;
      await this.storageService.updateControl(this.newControl);
    }

    await this.loaderToShow.dismiss();

    this.navCtrl.back();
  }
}