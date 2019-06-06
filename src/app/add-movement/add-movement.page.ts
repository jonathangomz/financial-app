import { Component, OnInit } from '@angular/core';
import { StorageService, Movement } from '../services/storage.service';
import { Md5 } from 'ts-md5/dist/md5';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-add-movement',
  templateUrl: './add-movement.page.html',
  styleUrls: ['./add-movement.page.scss'],
  providers: [Md5]
})
export class AddMovementPage implements OnInit {

  private newMovement:Movement = <Movement>{};
  public movement:Movement = <Movement>{};

  private loaderToShow: HTMLIonLoadingElement;
  private alert:HTMLIonAlertElement;
  public today:string = new Date().toISOString();
  public control_id:string;
  public type:string;
  public isEntry:boolean = false;
  titleTemplate:string = 'Agrega una nueva';
  buttonTemplate:string = 'CREAR';
  public wordType;
  masks:any;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private storageService: StorageService,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) { 
    this.route.queryParams.subscribe(async params => {
      this.control_id = params["id"];
      this.type = params["type"];

      if(this.type.includes('IN')) {
        this.wordType = 'entrada';
        this.isEntry = true;
      }
      else if(this.type.includes('OUT')) {
        this.wordType = 'salida';
        this.isEntry = false;
      }
      else if(this.type.includes('UPDATE')){
        this.titleTemplate = 'Actualizar';
        this.buttonTemplate = 'ACTUALIZAR';
        this.movement = await storageService.getMovement(params['movement_id']);
        if(this.movement.amount >= 0){
          this.type += "-IN";
          this.isEntry = true;
        } else {
          this.type += "-OUT";
          this.movement.amount = Math.abs(this.movement.amount);
        }
      }
    });
  }

  async ngOnInit() {
    this.loaderToShow = await this.loadingController.create({
      message: 'Guardando...'
    });
  }

  async addOrUpdate(form:any){
    let time = new Date();
    let hash = Md5.hashStr(time.toString());

    this.newMovement.id_control = this.control_id;
    this.newMovement.date = form.value["date"];
    this.newMovement.description = form.value['description'];
    this.newMovement.isEntry = form.value['isEntry'];

    if(this.newMovement.isEntry) {
      this.newMovement.amount = Math.abs(form.value['amount']);
    } else {
      this.newMovement.amount = -Math.abs(form.value['amount']);
    }
    
    await this.loaderToShow.present();

    if(this.type.includes('UPDATE')){
      this.newMovement.id = this.movement.id;
      await this.storageService.updateMovement(this.newMovement);
    } else {
      this.newMovement.id = hash.toString();
      await this.storageService.addMovement(this.newMovement);
    }

    await this.loaderToShow.dismiss();

    this.navCtrl.back();
  }

  async delete(){
    this.alert = await this.alertController.create({
      header: 'Eliminar Movimiento',
      message: '¿Está seguro que desea eliminar el movimiento? No de podrán recuperar los datos.',
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
            this.storageService.deleteMovement(this.movement.id);
            await this.loaderToShow.dismiss();
            this.navCtrl.back();
          }
        }
      ]
    });
    this.alert.present();
  }
}
