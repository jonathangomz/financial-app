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
    return this.storage.get(MOVEMENTS_KEY).then((movements: Movement[]) => {
      if (movements) {
        movements.push(movement);
        return this.storage.set(MOVEMENTS_KEY, movements);
      } else {
        return this.storage.set(MOVEMENTS_KEY, [movement]);
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

    return this.storage.get(CONTROLLES_KEY).then(controllers => {
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
    return this.storage.get(MOVEMENTS_KEY).then(movements => {
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
  updateItem(item: Item): Promise<any> {
    return this.storage.get(ITEMS_KEY).then((items: Item[]) => {
      if (!items || items.length === 0) {
        return null;
      }

      let newItems: Item[] = [];

      for (let i of items) {
        if (i.id === item.id) {
          newItems.push(item);
        } else {
          newItems.push(i);
        }
      }

      return this.storage.set(ITEMS_KEY, newItems);
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