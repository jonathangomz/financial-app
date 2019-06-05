import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { StorageService, Control, Movement } from '../services/storage.service';
import { NavController } from '@ionic/angular';

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
  
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private storageService: StorageService
  ) { 
    this.route.queryParams.subscribe(async params => {
      this.control_id = params["id"];
      this.list_movements = await storageService.getMovementsById(this.control_id);
      this.control = await storageService.getControl(this.control_id);
    });
    
  }

  ngOnInit() {
    this.storageService.getControl(this.control_id).then(control => {
      this.control = control;
    });
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
