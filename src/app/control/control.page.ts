import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { StorageService, Control, Movement } from '../services/storage.service';
import { NavController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})
export class ControlPage implements OnInit {

  control_id:string = null;
  control:Control = null;
  list_movements:Movement[] = [];
  TOTAL:number = 0;
  alert:HTMLIonAlertElement;
  loaderToShow: HTMLIonLoadingElement;
  
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private storageService: StorageService,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) { 
    this.route.queryParams.subscribe(async params => {
      this.control_id = params["id"];
      this.list_movements = await storageService.getMovementsById(this.control_id);
      this.control = await storageService.getControl(this.control_id);
    });
    
  }

  async ngOnInit() {
    this.storageService.getControl(this.control_id).then(control => {
      this.control = control;
    });

    this.loaderToShow = await this.loadingController.create({
      message: 'Guardando...'
    });
  }

  public addMovement(type:string){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id:this.control_id,
        type:type
      }
    };
    this.navCtrl.navigateForward('add-movement', navigationExtras);
  }

  public async delete(){
    this.alert = await this.alertController.create({
      header: 'Eliminar Control',
      message: '¿Está seguro que desea eliminar el control? Perderá todos los movimientos.',
      cssClass:'alert-delete',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'btn-cancel'
        }, {
          text: 'Aceptar',
          cssClass: 'btn-delete',
          handler: async () => {
            await this.loaderToShow.present();
            await this.storageService.deleteControl(this.control_id);
            await this.loaderToShow.dismiss();
            this.navCtrl.back();
          }
        }
      ]
    });
    this.alert.present();
  }

  public updateControl(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id:this.control_id,
        type:'UPDATE'
      }
    };
    this.navCtrl.navigateForward('add-control', navigationExtras);
  }

  public updateMovement(id:string){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id:this.control_id,
        movement_id:id,
        type:'UPDATE'
      }
    };
    this.navCtrl.navigateForward('add-movement', navigationExtras);
  }

}
