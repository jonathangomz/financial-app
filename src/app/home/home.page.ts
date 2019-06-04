import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StorageService, Control } from '../services/storage.service';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  card_testbed:Control = {
    id:'12345678',
    title: 'Card Title',
    content:`Keep close to Nature's heart... and break clear away, once in awhile,
    and climb a mountain or spend a week in the woods. Wash your spirit clean.`,
    totalAmount: 0
  };

  list_controlles:Control[] = [];

  constructor(
    private storageService: StorageService,
    private navCtrl: NavController,
    private storage: Storage
  ) {
    storageService.getControlles().then(controlles => {
      if(controlles){
        this.list_controlles = controlles;
      }
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
}
