import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StorageService, Control } from '../services/storage.service';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  list_controlles:Control[] = [];

  constructor(
    private storageService: StorageService,
    private navCtrl: NavController,
    private storage: Storage,
    private route: ActivatedRoute
  ) {
    //storage.clear();
    this.route.queryParams.subscribe(async params => {
      this.list_controlles = await storageService.getControlles();
    });
  }

  public viewControl(control: Control){

    let navigationExtras: NavigationExtras = {
      queryParams: {
        id:control.id
      }
    };

    this.navCtrl.navigateForward('control', navigationExtras);
  }

  public addMovement(id:string, type:string){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id:id,
        type:type
      }
    };
    this.navCtrl.navigateForward('add-movement', navigationExtras);
  }

  public addControl(){
    this.navCtrl.navigateForward('add-control');
  }
}
