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

const CONTROLLES_KEY = 'controlles';
const MOVEMENTS_KEY = 'movements';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  // CREATE
  addControl(control: Control): Promise<Control[]> {
    return this.storage.get(CONTROLLES_KEY).then((controlles: Control[]) => {
      if (controlles) {
        controlles.push(control);
        return this.storage.set(CONTROLLES_KEY, controlles);
      } else {
        return this.storage.set(CONTROLLES_KEY, [control]);
      }
    });
  }
  addMovement(movement:Movement): Promise<Movement[]>{
    return this.storage.get(MOVEMENTS_KEY).then(async (movements: Movement[]) => {
      if (movements) {
        movements.push(movement);
      } else {
        movements = [movement];
      }

      try {
        let movement_result:Movement[] = await this.storage.set(MOVEMENTS_KEY, movements);

        await this.updateTotalControl(movement);

        return movement_result;
      } catch (error) {
        console.error(error);
      }
    });
  }

  async updateTotalControl(movement: Movement, movementDeleting:boolean = false): Promise<any>{
    let controlles:Control[] = await this.storage.get(CONTROLLES_KEY);
    let tmp_control:Control = <Control>{};

    controlles.forEach(ctrl => {
      if(ctrl.id === movement.id_control){
        tmp_control = ctrl;
        tmp_control.totalAmount += movementDeleting ? -movement.amount : movement.amount;
      }
    });

    await this.updateControl(tmp_control);
  }

  // READ
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
  getMovement(id:string): Promise<Movement>{
    let movementToReturn:Movement = null;

    return this.storage.get(MOVEMENTS_KEY).then((movements: Movement[]) => {
      if(movements){
        for(let movement of movements){
          if(movement.id === id){
            movementToReturn = movement;
            break;
          }
        }
      }

      return movementToReturn;
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
  updateMovement(movement: Movement): Promise<any> {
    return this.storage.get(MOVEMENTS_KEY).then((movements: Movement[]) => {
      if (!movements || movements.length === 0) {
        return null;
      }

      let newMovement: Movement[] = [];

      for (let m of movements) {
        if (m.id === movement.id) {
          newMovement.push(movement);
        } else {
          newMovement.push(m);
        }
      }

      return this.storage.set(MOVEMENTS_KEY, newMovement).then(() => {
        this.updateTotalControl(movement);
      });
    });
  }

  // DELETE
  deleteControl(id: string): Promise<Control> {
    return this.storage.get(CONTROLLES_KEY).then((controlles: Control[]) => {
      if (!controlles || controlles.length === 0) {
        return null;
      }

      let toKeep: Control[] = [];
      let control_deleted:Control = <Control>{};
      for (let c of controlles) {
        if (c.id !== id) {
          toKeep.push(c);
        }else{
          control_deleted = c;
        }
      }

      this.storage.set(CONTROLLES_KEY, toKeep).then(() => {
        this.deleteMovementsByControl(id);
      });

      return control_deleted;
    });
  }

  // DELETE
  deleteMovement(id: string): Promise<Movement> {
    return this.storage.get(MOVEMENTS_KEY).then(async (movements: Movement[]) => {
      if (!movements || movements.length === 0) {
        return null;
      }

      let toKeep: Movement[] = [];
      let movement_deleted:Movement = <Movement>{};
      for (let m of movements) {
        if (m.id !== id) {
          toKeep.push(m);
        }else{
          movement_deleted = m;
        }
      }

      await this.storage.set(MOVEMENTS_KEY, toKeep).then(() => {
        this.updateTotalControl(movement_deleted, true);
      });

      return movement_deleted;
    });
  }

  // DELETE
  deleteMovementsByControl(control_id: string): Promise<any> {
    return this.storage.get(MOVEMENTS_KEY).then(async (movements: Movement[]) => {
      if (!movements || movements.length === 0) {
        return null;
      }

      let toKeep: Movement[] = [];
      let movements_deleted:Movement[] = [];
      for (let m of movements) {
        if (m.id_control !== control_id) {
          toKeep.push(m);
        }else{
          movements_deleted.push(m);
        }
      }
      await this.storage.set(MOVEMENTS_KEY, toKeep);

      return movements_deleted;
    });
  }
}