import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { StorageService, Movement } from '../services/storage.service';
import { Md5 } from 'ts-md5/dist/md5';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-add-movement',
  templateUrl: './add-movement.page.html',
  styleUrls: ['./add-movement.page.scss'],
})
export class AddMovementPage implements OnInit {

  masks:any;
  public today:string = new Date().toISOString();
  public control_id:string = null;
  public type:string = null;
  public wordType:string = null;
  private newMovement:Movement = <Movement>{};
  private loaderToShow: HTMLIonLoadingElement;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private storageService: StorageService,
    public loadingController: LoadingController
  ) { 
    this.route.queryParams.subscribe(params => {
      this.control_id = params["id"];
      this.type = params["type"];
      if(this.type !== 'IN') {
        this.wordType = 'salida';
      } else {
        this.wordType = 'entrada';
      }
    });
  }

  async ngOnInit() {
    this.loaderToShow = await this.loadingController.create({
      message: 'Guardando...'
    });
  }

  async addNew(form:any){
    let time = new Date();
    let hash = Md5.hashStr(time.toString());
    
    this.newMovement.id = hash.toString();
    this.newMovement.id_control = this.control_id;
    this.newMovement.date = form.value["date"];
    this.newMovement.description = form.value['description'];
    if(this.type !== 'IN') {
      this.newMovement.amount = -form.value['amount'];
    } else {
      this.newMovement.amount = +form.value['amount'];
    }
    
    await this.loaderToShow.present();
    await this.storageService.addMovement(this.newMovement);
    await this.loaderToShow.dismiss();

    this.navCtrl.back();
  }

}
