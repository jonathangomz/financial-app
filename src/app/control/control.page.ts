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
    this.route.queryParams.subscribe(params => {
      this.control_id = params["id"];
      storageService.getMovementsById(this.control_id).then(list => {
          if(list){
            this.list_movements = list
          }
          return list;
        }).then(list => {
          if(list.length !== 0){
            this.TOTAL = list.map(item => item.amount).reduce((sum, current) => sum + current);
          }
        });
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
