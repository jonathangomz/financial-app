import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export interface Control {
  id: string,
  title: string,
  content: string,
  totalAmount:number
}

export interface Movement {
  id: string,
  id_control:string,
  description: string,
  date:Date,
  amount: number
}

export interface Item {
  id: string,
  title: string,
  content: string
}

const ITEMS_KEY = 'my-items';
const CONTROLLES_KEY = 'controlles';
const MOVEMENTS_KEY = 'movements';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  // CREATE
  addControl(control: Control): Promise<any> {
    return this.storage.get(CONTROLLES_KEY).then((controlles: Control[]) => {
      if (controlles) {
        controlles.push(control);
        return this.storage.set(CONTROLLES_KEY, controlles);
      } else {
        return this.storage.set(CONTROLLES_KEY, [control]);
      }
    });
  }
  addMovement(movement:Movement): Promise<any>{
    return this.storage.get(MOVEMENTS_KEY).then(async (movements: Movement[]) => {
      if (movements) {
        movements.push(movement);
      } else {
        movements = [movement];
      }

      try {
        let movement_result:Movement[] = await this.storage.set(MOVEMENTS_KEY, movements);
        let controlles:Control[] = await this.storage.get(CONTROLLES_KEY);
        let tmp_control:Control = <Control>{};

        controlles.forEach(ctrl => {
          if(ctrl.id === movement.id_control){
            tmp_control = ctrl;
            tmp_control.totalAmount += movement.amount;
          }
        });

        await this.updateControl(tmp_control);

        return movement_result;
      } catch (error) {
        console.error(error);
      }
    });
  }

  // READ
  getItems(): Promise<Item[]> {
    return this.storage.get(ITEMS_KEY);
  }
  getControlles(): Promise<Control[]> {
    return this.storage.get(CONTROLLES_KEY);
  }
  getControl(id:string): Promise<Control>{
    let controlToReturn:Control = null;

    return this.storage.get(CONTROLLES_KEY).then((controllers: Control[]) => {
      if(controllers){
        for(let control of controllers){
          if(control.id === id){
            controlToReturn = control;
            break;
          }
        }
      }
      return controlToReturn;
    });
  }

  getMovementsById(id:string): Promise<Movement[]>{
    let list_movements:Movement[] = [];
    return this.storage.get(MOVEMENTS_KEY).then((movements: Movement[]) => {
      if(movements){
        for(let movement of movements){
          if(movement.id_control === id){
            list_movements.push(movement);
          }
        }
      }
      return list_movements;
    });
  }

  // UPDATE
  updateControl(control: Control): Promise<any> {
    return this.storage.get(CONTROLLES_KEY).then((controllers: Control[]) => {
      if (!controllers || controllers.length === 0) {
        return null;
      }

      let newControl: Control[] = [];

      for (let c of controllers) {
        if (c.id === control.id) {
          newControl.push(control);
        } else {
          newControl.push(c);
        }
      }

      return this.storage.set(CONTROLLES_KEY, newControl);
    });
  }

  // DELETE
  deleteItem(id: string): Promise<Item> {
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if (!items || items.length === 0) {
        return null;
      }

      let toKeep: Item[] = [];

      for (let i of items) {
        if (i.id !== id) {
          toKeep.push(i);
        }
      }
      return this.storage.set(ITEMS_KEY, toKeep);
    });
  }
}