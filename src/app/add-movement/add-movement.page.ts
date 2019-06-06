import { Component, OnInit } from '@angular/core';
import { StorageService, Movement } from '../services/storage.service';
import { Md5 } from 'ts-md5/dist/md5';
import { NavController, LoadingController } from '@ionic/angular';
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
  public today:string = new Date().toISOString();
  public type:string;
  public control_id:string;
  titleTemplate:string = 'Argega una nueva';
  buttonTemplate:string = 'CREAR';
  public wordType;
  masks:any;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private storageService: StorageService,
    public loadingController: LoadingController
  ) { 
    this.route.queryParams.subscribe(async params => {
      this.control_id = params["id"];
      this.type = params["type"];

      if(this.type.includes('IN')) {
        this.wordType = 'entrada';
      }
      else if(this.type.includes('OUT')) {
        this.wordType = 'salida';
      }
      else if(this.type.includes('UPDATE')){
        this.titleTemplate = 'Actualizar';
        this.buttonTemplate = 'ACTUALIZAR';
        this.movement = await storageService.getMovement(params['movement_id']);
        if(this.movement.amount >= 0){
          this.type += "-IN";
        } else {
          this.type += "OUT";
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
    
    await this.loaderToShow.present();
    if(this.type.includes('UPDATE')){
      this.newMovement.id = this.movement.id;
      if(this.type.includes('IN')){
        this.newMovement.amount = Math.abs(form.value['amount']);
      }
      else if(this.type.includes('OUT')){
        this.newMovement.amount = -Math.abs(form.value['amount']);
      }
      await this.storageService.updateMovement(this.newMovement);
    } else {
      this.newMovement.id = hash.toString();
      if(this.type === 'IN'){
        this.newMovement.amount = +form.value['amount'];
      }
      else if(this.type === 'OUT'){
        this.newMovement.amount = -form.value['amount'];
      }
      await this.storageService.addMovement(this.newMovement);
    }
    await this.loaderToShow.dismiss();

    this.navCtrl.back();
  }

}
